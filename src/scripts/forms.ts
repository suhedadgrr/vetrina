import { track } from './analytics';
import { contact, isPlaceholder } from '@content/site';

const ENDPOINT = 'https://api.web3forms.com/submit';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, o: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const MSG = {
  required: 'Bu alan zorunludur.',
  email: 'Geçerli bir e-posta adresi girin.',
  tel: 'Geçerli bir telefon numarası girin (örn. 0532 123 45 67).',
  short: 'Lütfen en az 2 karakter girin.',
  kvkk: 'Devam etmek için KVKK onayı gereklidir.',
};

let tsPromise: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return (tsPromise ??= new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error('turnstile'));
    document.head.appendChild(s);
  }));
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(setup);
}

function setup(form: HTMLFormElement) {
  const sitekeyOf = () => form.dataset.sitekey || '';
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const tsBox = form.querySelector<HTMLElement>('[data-turnstile]');
  let widgetId: string | undefined;
  let tsReady = false;

  // Turnstile: form ile ilk etkileşimde yüklenir (performans)
  const initTs = () => {
    const sitekey = sitekeyOf();
    if (!sitekey || !tsBox || tsReady) return;
    tsReady = true;
    loadTurnstile()
      .then(() => {
        widgetId = window.turnstile!.render(tsBox, {
          sitekey,
          theme: 'auto',
          language: 'tr',
          appearance: 'interaction-only',
        });
      })
      .catch(() => {
        tsReady = false;
      });
  };
  form.addEventListener('focusin', initTs, { once: true });
  form.addEventListener('pointerenter', initTs, { once: true });

  const fieldOf = (el: Element) => el.closest<HTMLElement>('.field');
  const errOf = (el: HTMLElement) => form.querySelector<HTMLElement>(`[data-err="${el.id}"]`);

  const validateOne = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string => {
    if (el.type === 'checkbox')
      return el.required && !(el as HTMLInputElement).checked ? MSG.kvkk : '';
    const v = el.value.trim();
    if (el.required && !v) return MSG.required;
    if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MSG.email;
    if (v && el.type === 'tel' && v.replace(/\D/g, '').length < 10) return MSG.tel;
    if (v && el.name === 'name' && v.length < 2) return MSG.short;
    return '';
  };
  const show = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, msg: string) => {
    const f = fieldOf(el);
    const e = errOf(el);
    f?.classList.toggle('has-err', !!msg);
    if (e) e.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (e && msg) {
      el.setAttribute('aria-describedby', e.dataset.err ? `${e.dataset.err}-err` : '');
      e.id = `${el.id}-err`;
    }
  };

  const fields = [
    ...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input[required], select[required], textarea[required]',
    ),
  ];
  fields.forEach((el) => {
    el.addEventListener('blur', () => {
      if (el.type !== 'checkbox') show(el, validateOne(el));
    });
    el.addEventListener('input', () => {
      if (fieldOf(el)?.classList.contains('has-err')) show(el, validateOne(el));
    });
    el.addEventListener('change', () => {
      if (el.type === 'checkbox' || el.tagName === 'SELECT') show(el, validateOne(el));
    });
  });

  const setStatus = (kind: 'error' | 'ok' | '', html = '') => {
    status.className = `form__status${kind ? ` is-${kind}` : ''}`;
    status.innerHTML = html;
  };
  const fallbackLinks = () => {
    const wa = isPlaceholder(contact.whatsapp)
      ? ''
      : ` veya <a href="https://wa.me/${contact.whatsapp}" target="_blank" rel="noopener">WhatsApp’tan yazın</a>`;
    const mail = isPlaceholder(contact.email)
      ? ''
      : `<a href="mailto:${contact.email}">${contact.email}</a> adresine e-posta gönderin`;
    return mail || wa ? ` Alternatif olarak ${mail}${mail && wa ? '' : ''}${wa}.` : '';
  };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setStatus('');

    let firstBad: HTMLElement | null = null;
    fields.forEach((el) => {
      const m = validateOne(el);
      show(el, m);
      if (m && !firstBad) firstBad = el;
    });
    if (firstBad) {
      (firstBad as HTMLElement).focus();
      setStatus('error', 'Lütfen işaretli alanları kontrol edin.');
      return;
    }

    const key = form.dataset.key || '';
    const data = new FormData(form);

    // Honeypot dolu ise: botu oyalamak için başarılı gibi davran, hiçbir şey gönderme.
    if ((data.get('company_website') as string)?.trim() || data.get('botcheck')) {
      done(form, status);
      return;
    }

    if (!key) {
      setStatus(
        'error',
        `Form altyapısı henüz yapılandırılmadı (PUBLIC_WEB3FORMS_KEY).${fallbackLinks()}`,
      );
      return;
    }
    if (sitekeyOf() && !data.get('cf-turnstile-response')) {
      initTs();
      setStatus('error', 'Güvenlik doğrulaması yükleniyor… Birkaç saniye sonra tekrar deneyin.');
      return;
    }

    data.delete('company_website');
    data.delete('botcheck');
    data.delete('kvkk');
    data.set('access_key', key);
    data.set('kvkk_onay', 'Evet');

    form.classList.add('is-busy');
    submit.disabled = true;
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
        signal: ctrl.signal,
      });
      clearTimeout(to);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || String(res.status));
      track(form.dataset.event || 'form_submit', { form: form.id || 'form' });
      done(form, status);
    } catch (err) {
      const offline = !navigator.onLine;
      setStatus(
        'error',
        `${offline ? 'İnternet bağlantınız yok gibi görünüyor.' : 'Gönderilemedi.'} Lütfen tekrar deneyin.${fallbackLinks()}`,
      );
      if (widgetId) window.turnstile?.reset(widgetId);
      void err;
    } finally {
      form.classList.remove('is-busy');
      submit.disabled = false;
    }
  });
}

function done(form: HTMLFormElement, status: HTMLElement) {
  const redirect = form.dataset.redirect;
  if (form.hasAttribute('data-reveal-download')) {
    const dl = form.parentElement!.querySelector<HTMLElement>('[data-download]');
    form.hidden = true;
    if (dl) {
      dl.hidden = false;
      dl.querySelector<HTMLElement>('a')?.focus();
    }
    return;
  }
  if (redirect) {
    try {
      sessionStorage.setItem('vt_lead', '1');
    } catch {
      /* yok say */
    }
    status.className = 'form__status is-ok';
    status.textContent = 'Teşekkürler! Yönlendiriliyorsunuz…';
    setTimeout(() => {
      location.href = redirect;
    }, 400);
  }
}
