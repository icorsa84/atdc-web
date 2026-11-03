/* ================================================================
   ATDC — ventanas propias de confirmación, aviso y texto
   Reemplazan confirm(), alert() y prompt() del navegador: algunos
   navegadores (por ejemplo, el integrado en apps) no muestran esas
   ventanas nativas y las responden «Cancelar» solos, dejando botones
   que parecen no hacer nada. Todas devuelven una Promesa:
     await atdcConfirmar(mensaje, {ok, cancelar, peligro})  → true/false
     atdcAvisar(mensaje, {titulo})                            → Promise<void>
     await atdcPedirTexto(mensaje, valorInicial, {ok})        → texto o null
   ================================================================ */
(function () {
  'use strict';
  var abierto = null;

  function estilos() {
    if (document.getElementById('atdcDlgCss')) return;
    var s = document.createElement('style');
    s.id = 'atdcDlgCss';
    s.textContent =
      '.atdc-dlg-fondo{position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,23,.62);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.atdc-dlg{background:var(--bg2,#111827);color:var(--text,#E5E7EB);border:1px solid var(--border2,var(--border,#334155));border-radius:14px;' +
      'box-shadow:0 20px 50px rgba(0,0,0,.45);width:100%;max-width:440px;padding:22px 22px 18px;font:15px/1.5 inherit;font-family:inherit}' +
      '.atdc-dlg h3{margin:0 0 8px;font-size:16px;font-weight:700}' +
      '.atdc-dlg p{margin:0 0 14px;white-space:pre-line;word-wrap:break-word}' +
      '.atdc-dlg input,.atdc-dlg textarea{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:9px;border:1px solid var(--border2,#475569);' +
      'background:var(--bg,#0B1120);color:var(--text,#E5E7EB);font:inherit;margin:0 0 14px}' +
      '.atdc-dlg .atdc-dlg-btns{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}' +
      '.atdc-dlg button{padding:9px 16px;border-radius:9px;font:inherit;font-weight:700;cursor:pointer;border:1px solid var(--border2,#475569);' +
      'background:transparent;color:var(--text,#E5E7EB)}' +
      '.atdc-dlg button.atdc-ok{background:#2563EB;border-color:#2563EB;color:#fff}' +
      '.atdc-dlg button.atdc-peligro{background:#DC2626;border-color:#DC2626;color:#fff}' +
      '.atdc-dlg button:focus-visible{outline:2px solid #93C5FD;outline-offset:2px}';
    document.head.appendChild(s);
  }

  function abrir(cfg) {
    return new Promise(function (resolver) {
      estilos();
      if (abierto) abierto.cerrar(cfg.tipo === 'texto' ? null : false);
      var previo = document.activeElement;
      var fondo = document.createElement('div');
      fondo.className = 'atdc-dlg-fondo';
      var caja = document.createElement('div');
      caja.className = 'atdc-dlg';
      caja.setAttribute('role', cfg.tipo === 'aviso' ? 'alertdialog' : 'dialog');
      caja.setAttribute('aria-modal', 'true');
      var idMsg = 'atdcDlgMsg' + Date.now();
      caja.setAttribute('aria-describedby', idMsg);
      if (cfg.titulo) {
        var h = document.createElement('h3'); h.textContent = cfg.titulo; caja.appendChild(h);
        caja.setAttribute('aria-label', cfg.titulo);
      } else {
        caja.setAttribute('aria-label', cfg.tipo === 'aviso' ? 'Aviso' : 'Confirmación');
      }
      var p = document.createElement('p'); p.id = idMsg; p.textContent = String(cfg.mensaje == null ? '' : cfg.mensaje); caja.appendChild(p);
      var campo = null;
      if (cfg.tipo === 'texto') {
        campo = document.createElement(cfg.multilinea ? 'textarea' : 'input');
        if (!cfg.multilinea) campo.type = 'text';
        if (cfg.multilinea) campo.rows = 3;
        campo.value = cfg.valor == null ? '' : String(cfg.valor);
        campo.setAttribute('aria-label', String(cfg.mensaje || 'Texto'));
        caja.appendChild(campo);
      }
      var btns = document.createElement('div'); btns.className = 'atdc-dlg-btns';
      var bCancel = null;
      if (cfg.tipo !== 'aviso') {
        bCancel = document.createElement('button'); bCancel.type = 'button'; bCancel.textContent = cfg.cancelar || 'Cancelar';
        btns.appendChild(bCancel);
      }
      var bOk = document.createElement('button'); bOk.type = 'button';
      bOk.className = cfg.peligro ? 'atdc-peligro' : 'atdc-ok';
      bOk.textContent = cfg.ok || (cfg.tipo === 'aviso' ? 'Entendido' : 'Aceptar');
      btns.appendChild(bOk);
      caja.appendChild(btns);
      fondo.appendChild(caja);
      document.body.appendChild(fondo);

      var hecho = false;
      function cerrar(valor) {
        if (hecho) return; hecho = true;
        document.removeEventListener('keydown', teclas, true);
        fondo.remove(); abierto = null;
        try { if (previo && previo.focus) previo.focus(); } catch (e) {}
        resolver(valor);
      }
      function cancelarValor() { return cfg.tipo === 'texto' ? null : (cfg.tipo === 'aviso' ? undefined : false); }
      function aceptarValor() { return cfg.tipo === 'texto' ? campo.value : (cfg.tipo === 'aviso' ? undefined : true); }
      function teclas(ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); cerrar(cancelarValor()); }
        else if (ev.key === 'Enter' && !(campo && cfg.multilinea) && document.activeElement !== bCancel) {
          ev.preventDefault(); ev.stopPropagation(); cerrar(aceptarValor());
        } else if (ev.key === 'Tab') {     // el foco no sale de la ventana
          var f = Array.prototype.slice.call(caja.querySelectorAll('button,input,textarea'));
          var i = f.indexOf(document.activeElement);
          if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
          else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); }
        }
      }
      document.addEventListener('keydown', teclas, true);
      bOk.addEventListener('click', function () { cerrar(aceptarValor()); });
      if (bCancel) bCancel.addEventListener('click', function () { cerrar(cancelarValor()); });
      fondo.addEventListener('click', function (ev) { if (ev.target === fondo && cfg.tipo !== 'aviso') cerrar(cancelarValor()); });
      abierto = { cerrar: cerrar };
      setTimeout(function () {
        if (campo) { campo.focus(); try { campo.select(); } catch (e) {} }
        else if (cfg.peligro && bCancel) bCancel.focus();   // en acciones peligrosas el foco parte en «Cancelar»
        else bOk.focus();
      }, 0);
    });
  }

  window.atdcConfirmar = function (mensaje, op) {
    op = op || {};
    return abrir({ tipo: 'confirmar', mensaje: mensaje, titulo: op.titulo, ok: op.ok, cancelar: op.cancelar, peligro: !!op.peligro });
  };
  window.atdcAvisar = function (mensaje, op) {
    op = op || {};
    return abrir({ tipo: 'aviso', mensaje: mensaje, titulo: op.titulo, ok: op.ok });
  };
  window.atdcPedirTexto = function (mensaje, valor, op) {
    op = op || {};
    return abrir({ tipo: 'texto', mensaje: mensaje, valor: valor, titulo: op.titulo, ok: op.ok, multilinea: !!op.multilinea });
  };
})();
