/* ATDC — PDF del Informe Final (Esencial, Profesional y Premium).
   Lo usan la pantalla del participante (agente-chat.html) y el panel del
   consultor (admin/dashboard.html), para que ambos obtengan exactamente el
   mismo documento. P = {nombre, cargo, sector, ats_score, disc, kostick_max:[nombre, puntaje]} */
window.ATDC_PDF = (function () {
  function escHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.97 64.00" aria-hidden="true"><defs><linearGradient id="atdcG1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#atdcG1)"/><line x1="21" y1="43" x2="43" y2="21" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/><circle cx="19" cy="45" r="5.2" fill="#FFFFFF" opacity="0.55"/><circle cx="32" cy="32" r="6.2" fill="#FFFFFF"/><circle cx="45" cy="19" r="5.2" fill="#FFFFFF"/><path d="M82.53424657534246 30.0 92.43835616438356 0.0H103.32876712328766L113.6027397260274 30.0H106.61643835616438L104.1917808219178 22.561643835616437H91.65753424657534L89.27397260273972 30.0ZM102.34246575342465 16.972602739726028 98.6027397260274 5.506849315068493H97.08219178082192L93.42465753424658 16.972602739726028ZM124.28767123287672 30.0V5.876712328767123H115.86301369863014V0.0H139.4931506849315V5.876712328767123H131.02739726027397V30.0ZM144.54794520547944 30.164383561643834V-0.24657534246575352H155.6849315068493Q159.75342465753425 -0.24657534246575352 162.7945205479452 0.9452054794520564Q165.83561643835617 2.1369863013698662 167.8904109589041 4.19178082191781Q169.94520547945206 6.2465753424657535 170.95205479452056 8.897260273972604Q171.95890410958904 11.547945205479454 171.95890410958904 14.465753424657535V15.36986301369863Q171.95890410958904 18.08219178082192 170.95205479452056 20.732876712328768Q169.94520547945206 23.383561643835616 167.8904109589041 25.5Q165.83561643835617 27.616438356164384 162.7945205479452 28.89041095890411Q159.75342465753425 30.164383561643834 155.6849315068493 30.164383561643834ZM151.2876712328767 6.041095890410961V23.876712328767123H156.05479452054794Q158.15068493150685 23.876712328767123 159.83561643835617 23.23972602739726Q161.52054794520546 22.602739726027398 162.71232876712327 21.43150684931507Q163.9041095890411 20.26027397260274 164.52054794520546 18.595890410958905Q165.13698630136986 16.93150684931507 165.13698630136986 14.917808219178083Q165.13698630136986 12.82191780821918 164.52054794520546 11.178082191780824Q163.9041095890411 9.534246575342468 162.71232876712327 8.383561643835618Q161.52054794520546 7.232876712328768 159.83561643835617 6.6369863013698644Q158.15068493150685 6.041095890410961 156.05479452054794 6.041095890410961ZM191.23287671232876 30.78082191780822Q187.16438356164383 30.78082191780822 184.24657534246575 29.363013698630137Q181.32876712328766 27.945205479452056 179.47945205479454 25.623287671232877Q177.63013698630138 23.301369863013697 176.74657534246575 20.60958904109589Q175.86301369863014 17.917808219178085 175.86301369863014 15.36986301369863V14.465753424657535Q175.86301369863014 11.671232876712331 176.76712328767124 8.938356164383563Q177.67123287671234 6.205479452054796 179.54109589041096 3.986301369863016Q181.41095890410958 1.767123287671236 184.2671232876712 0.43150684931507044Q187.12328767123287 -0.9041095890410951 191.02739726027397 -0.9041095890410951Q195.0958904109589 -0.9041095890410951 198.21917808219177 0.6164383561643856Q201.34246575342465 2.1369863013698662 203.21232876712327 4.828767123287674Q205.08219178082192 7.520547945205482 205.41095890410958 11.136986301369863H198.63013698630135Q198.34246575342465 9.328767123287673 197.31506849315068 8.054794520547947Q196.2876712328767 6.780821917808222 194.66438356164383 6.082191780821919Q193.04109589041096 5.383561643835616 191.02739726027397 5.383561643835616Q189.013698630137 5.383561643835616 187.45205479452056 6.082191780821919Q185.8904109589041 6.780821917808222 184.84246575342468 8.054794520547947Q183.7945205479452 9.328767123287673 183.23972602739727 11.075342465753426Q182.68493150684932 12.82191780821918 182.68493150684932 14.958904109589042Q182.68493150684932 17.054794520547944 183.23972602739727 18.801369863013697Q183.7945205479452 20.54794520547945 184.8835616438356 21.842465753424655Q185.97260273972603 23.136986301369863 187.5753424657534 23.815068493150683Q189.17808219178082 24.493150684931507 191.23287671232876 24.493150684931507Q194.35616438356163 24.493150684931507 196.513698630137 22.972602739726028Q198.67123287671234 21.45205479452055 199.12328767123287 18.78082191780822H205.86301369863014Q205.4931506849315 22.068493150684933 203.66438356164383 24.801369863013697Q201.83561643835617 27.534246575342465 198.6917808219178 29.15753424657534Q195.54794520547944 30.78082191780822 191.23287671232876 30.78082191780822Z" fill="#0F172A"/><path d="M87.4522052379145 54.226650564162725Q86.2056271350195 54.226650564162725 85.3053207273731 53.79223698285083Q84.40501431972672 53.35782340153894 83.81320451330183 52.64009661502364Q83.22139470687692 51.92236982850833 82.93808150167351 51.097613608916184Q82.6547682964701 50.27285738932404 82.6547682964701 49.51735550878161V49.24033815258272Q82.6547682964701 48.40928608398606 82.95067319968254 47.5782340153894Q83.246578102895 46.74718194679273 83.84468375832442 46.060934405300024Q84.44278941375384 45.37468686380732 85.34309582140023 44.95916082950899Q86.24340222904662 44.54363479521066 87.4522052379145 44.54363479521066Q88.66100824678237 44.54363479521066 89.55501880542424 44.95916082950899Q90.4490293640661 45.37468686380732 91.05343086850004 46.060934405300024Q91.657832372934 46.74718194679273 91.95373727614644 47.5782340153894Q92.24964217935889 48.40928608398606 92.24964217935889 49.24033815258272V49.51735550878161Q92.24964217935889 50.27285738932404 91.96003312515096 51.097613608916184Q91.67042407094303 51.92236982850833 91.08491011352265 52.64009661502364Q90.49939615610228 53.35782340153894 89.59279389945137 53.79223698285083Q88.68619164280045 54.226650564162725 87.4522052379145 54.226650564162725ZM87.4522052379145 52.82897208515924Q88.20770711845692 52.82897208515924 88.81210862289086 52.551954728960354Q89.4165101273248 52.274937372761464 89.84462785963217 51.79645284841793Q90.27274559193955 51.31796832407439 90.49310030709776 50.700975121631416Q90.71345502225596 50.08398191918843 90.71345502225596 49.39143852869121Q90.71345502225596 48.661120044166864 90.48680445809323 48.037830992719364Q90.26015389393051 47.414541941271864 89.83833201062765 46.94235326593285Q89.4165101273248 46.47016459059384 88.81210862289086 46.20573893240399Q88.20770711845692 45.94131327421414 87.4522052379145 45.94131327421414Q86.69670335737207 45.94131327421414 86.09230185293814 46.20573893240399Q85.4879003485042 46.47016459059384 85.05978261619683 46.94235326593285Q84.63166488388944 47.414541941271864 84.41131016873123 48.037830992719364Q84.19095545357303 48.661120044166864 84.19095545357303 49.39143852869121Q84.19095545357303 50.08398191918843 84.41131016873123 50.700975121631416Q84.63166488388944 51.31796832407439 85.05978261619683 51.79645284841793Q85.4879003485042 52.274937372761464 86.09230185293814 52.551954728960354Q86.69670335737207 52.82897208515924 87.4522052379145 52.82897208515924ZM99.35135985645768 54.226650564162725Q98.0795983575446 54.226650564162725 97.21706704392534 53.741870190814666Q96.35453573030607 53.257089817466614 95.90753045098512 52.37567095683379Q95.46052517166419 51.49425209620096 95.46052517166419 50.3232241813602V44.8080604534005H96.97152893274904V50.449141161450605Q96.97152893274904 51.154276249956865 97.24854628894792 51.695719264345605Q97.52556364514682 52.237162278734345 98.05441496152652 52.53306718194679Q98.58326627790622 52.82897208515924 99.35135985645768 52.82897208515924Q100.11945343500915 52.82897208515924 100.64200890238433 52.539363030951314Q101.1645643697595 52.249753976743385 101.4415817259584 51.708310962354645Q101.71859908215728 51.16686794796591 101.71859908215728 50.449141161450605V44.8080604534005H103.22960284324212V50.3232241813602Q103.22960284324212 51.49425209620096 102.78889341292572 52.37567095683379Q102.3481839826093 53.257089817466614 101.48565266899003 53.741870190814666Q100.62312135537076 54.226650564162725 99.35135985645768 54.226650564162725ZM108.8329084572651 54.0V46.142780442358784H106.11310168731238V44.8080604534005H113.07631068631173V46.142780442358784H110.34391221834996V54.0ZM116.1235016044995 54.0V44.7451019633553H119.12032573065112Q120.26617024947379 44.7451019633553 121.05315137503882 45.11655705462199Q121.84013250060384 45.48801214588869 122.24936268589767 46.16166798937235Q122.65859287119147 46.835323832856005 122.65859287119147 47.767109485525V47.96857665366964Q122.65859287119147 48.887770608329596 122.24936268589767 49.56772230081778Q121.84013250060384 50.24767399330596 121.05315137503882 50.61912908457265Q120.26617024947379 50.990584175839345 119.12032573065112 50.990584175839345H117.63450536558435V54.0ZM117.63450536558435 46.06723025430455V49.6684558848901H119.29660950277768Q119.90101100721162 49.6684558848901 120.2976494944964 49.43550947172285Q120.69428798178117 49.202563058555604 120.90834684793487 48.79333287326179Q121.12240571408854 48.38410268796798 121.12240571408854 47.86784306959732Q121.12240571408854 47.33899175321763 120.90834684793487 46.92976156792381Q120.69428798178117 46.52053138263 120.2976494944964 46.29388081846727Q119.90101100721162 46.06723025430455 119.29660950277768 46.06723025430455ZM125.80651737345157 54.0V44.8080604534005H127.31752113453642V52.65268831303268H131.15798902729375V54.0ZM133.2859859908216 54.0 136.50946068113592 44.8080604534005H139.01520858493495L142.33941685932163 54.0H140.77804630620062L139.85885235154066 51.406110210137676H135.6910003105483L134.7969897519064 54.0ZM139.39295952520618 50.09657361719747 137.9700976501846 46.105005348331666H137.51679652185913L136.14430143887375 50.09657361719747ZM149.4411345364204 54.226650564162725Q148.18196473551637 54.226650564162725 147.29425002587902 53.79223698285083Q146.40653531624167 53.35782340153894 145.85879645284842 52.64639246402815Q145.31105758945515 51.93496152651738 145.05292778026984 51.110205306925224Q144.7947979710845 50.28544908733308 144.7947979710845 49.51735550878161V49.24033815258272Q144.7947979710845 48.39669438597702 145.05922362927436 47.56564231738035Q145.3236492874642 46.73459024878369 145.87138815085746 46.0546385562955Q146.4191270142507 45.37468686380732 147.29425002587902 44.95916082950899Q148.1693730375073 44.54363479521066 149.36558434836616 44.54363479521066Q150.61216245126116 44.54363479521066 151.51876470791206 44.98434422552707Q152.42536696456298 45.425053655843485 152.9605141299472 46.212034781408505Q153.49566129533142 46.99901590697353 153.59639487940373 48.069310237741966H152.07279942030985Q151.97206583623753 47.364175149235706 151.60061074497082 46.891986473896694Q151.22915565370414 46.419797798557674 150.6562333942928 46.18055553638591Q150.08331113488146 45.94131327421414 149.36558434836616 45.94131327421414Q148.6226741658328 45.94131327421414 148.04975190642145 46.20573893240399Q147.4768296470101 46.47016459059384 147.0990787067389 46.936057416928335Q146.72132776646768 47.401950243262824 146.52615644732754 48.025239294710325Q146.33098512818742 48.648528346157825 146.33098512818742 49.39143852869121Q146.33098512818742 50.09657361719747 146.52615644732754 50.71986266864497Q146.72132776646768 51.34315172009247 147.11167040474794 51.82163624443601Q147.50201304302817 52.30012076877954 148.08752700044857 52.56454642696939Q148.67304095786895 52.82897208515924 149.4411345364204 52.82897208515924Q150.54920396121597 52.82897208515924 151.3047058417584 52.28123322176599Q152.06020772230082 51.733494358372724 152.22389979641832 50.713566819640455H153.76008695352127Q153.63416997343086 51.683127566336566 153.10531865705116 52.48270038991063Q152.57646734067146 53.2822732134847 151.65727338601152 53.75446188882371Q150.73807943135157 54.226650564162725 149.4411345364204 54.226650564162725ZM156.9206031537904 54.0V44.8080604534005H162.36021669369586V46.117597046340705H158.4190152168662V48.67371174217591H162.12097443152408V49.98324833511611H158.4190152168662V52.690463407059795H162.4735419757772V54.0ZM165.96144232428145 54.0V44.8080604534005H168.001297401746L170.51963700355407 50.61283323556813H170.73369586970776L173.22685207549776 44.8080604534005H175.29189054898038V54.0H173.7934784859046V46.53312308063904L171.4010558641869 52.11124529864394H169.73895172699358L167.3465291052759 46.5834898726752V54.0ZM179.27086711983713 54.0V44.8080604534005H184.7104806597426V46.117597046340705H180.76927918291292V48.67371174217591H184.4712383975708V49.98324833511611H180.76927918291292V52.690463407059795H184.82380594182393V54.0ZM188.31170629032817 54.0V44.8080604534005H190.77967910010008L195.04826472516478 52.70305510506884H195.21195679928232V44.8080604534005H196.64741037231292V54.0H194.15425416652292L189.88566854145822 46.105005348331666H189.72197646734068V54.0ZM202.42699975846244 54.0V46.142780442358784H199.70719298850972V44.8080604534005H206.67040198750905V46.142780442358784H203.9380035195473V54.0Z" fill="#64748B"/></svg>`;
  const ISO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.00 64.00" aria-hidden="true"><defs><linearGradient id="atdcG2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#atdcG2)"/><line x1="21" y1="43" x2="43" y2="21" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/><circle cx="19" cy="45" r="5.2" fill="#FFFFFF" opacity="0.55"/><circle cx="32" cy="32" r="6.2" fill="#FFFFFF"/><circle cx="45" cy="19" r="5.2" fill="#FFFFFF"/></svg>`;
  function md(md) {
  if (!md) return '';
  // Fix CHAT-SEC-01: separar escape HTML del parsing de Markdown para evitar XSS residual
  // en celdas de tabla. El escape se aplica por celda dentro del parser, no al string completo.
  // El resto del contenido (fuera de tablas) se escapa antes de aplicar transformaciones inline.

  // Paso 1: extraer y procesar tablas ANTES del escape global
  const tablePlaceholders = [];
  let mdSinTablas = md.replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
    // Escapar cada celda individualmente para prevenir XSS
    const heads = header.split('|').filter(s=>s.trim())
      .map(s=>`<th style="padding:5px 10px;text-align:left;font-size:.78rem;color:var(--muted);font-weight:600;border-bottom:1px solid var(--border)">${escHtml(s.trim())}</th>`)
      .join('');
    const rowsHtml = rows.trim().split('\n').map(row=>{
      const cells = row.split('|').filter(s=>s.trim())
        .map(s=>`<td style="padding:5px 10px;font-size:.8rem;border-bottom:1px solid rgba(42,47,69,.4)">${escHtml(s.trim())}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    const tableHtml = `<div style="overflow-x:auto;margin:10px 0"><table style="width:100%;border-collapse:collapse;background:var(--bg2);border:1px solid var(--border);border-radius:8px;overflow:hidden"><thead><tr>${heads}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    tablePlaceholders.push(tableHtml);
    return `\x00TABLE${tablePlaceholders.length - 1}\x00`;
  });

  // Paso 2: escapar el resto del contenido
  let result = mdSinTablas
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    // Checkboxes
    .replace(/- \[ \] (.+)/g,'<div style="display:flex;align-items:flex-start;gap:8px;padding:3px 0"><span style="color:var(--border);flex-shrink:0;margin-top:1px">☐</span><span style="font-size:.81rem">$1</span></div>')
    .replace(/- \[x\] (.+)/g,'<div style="display:flex;align-items:flex-start;gap:8px;padding:3px 0"><span style="color:var(--green);flex-shrink:0;margin-top:1px">☑</span><span style="font-size:.81rem;color:var(--muted)"><del>$1</del></span></div>')
    // Bullets con estilo
    .replace(/^- (.+)$/gm,'<div style="display:flex;align-items:flex-start;gap:7px;padding:2px 0"><span style="color:var(--cyan);flex-shrink:0;font-size:.7rem;margin-top:3px">●</span><span style="font-size:.83rem">$1</span></div>')
    // Listas numeradas
    .replace(/^(\d+)\. (.+)$/gm,'<div style="display:flex;align-items:flex-start;gap:8px;padding:2px 0"><span style="color:var(--amber);flex-shrink:0;font-weight:700;font-size:.78rem;min-width:16px;margin-top:1px">$1.</span><span style="font-size:.83rem">$2</span></div>')
    // Bold e italic
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em style="color:var(--amber);font-style:normal;font-weight:600">$1</em>')
    // Headers
    .replace(/^### (.+)$/gm,'<div style="font-weight:700;font-size:.85rem;color:var(--text);margin:12px 0 6px">$1</div>')
    .replace(/^## (.+)$/gm,'<div style="font-weight:700;font-size:.9rem;color:var(--cyan);margin:14px 0 7px">$1</div>')
    // Saltos de línea
    .replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')
    .replace(/^(?!<)(.)/,'<p>$1').replace(/([^>])$/,'$1</p>');

  // Paso 3: reinyectar las tablas ya procesadas con escape por celda
  tablePlaceholders.forEach((tableHtml, i) => {
    result = result.replace(`\x00TABLE${i}\x00`, tableHtml);
  });

  return result;
}

  function html(inf, P) {
    P = P || {};
  const plan = inf.plan;
  const nombre = escHtml(inf.participante || P.nombre || '');
  const cargo = escHtml(String(inf.cargo || P.cargo || ''));
  const sector = escHtml(String(P.sector && P.sector !== 'Por definir' ? P.sector : ''));
  const fecha = escHtml(inf.fecha || new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }));
  const secciones = inf.secciones || [];
  const secs = secciones.map((sec, i) => `
    <section id="s${i}"><h2>${plan === 'Premium' ? `<span class="n">${String(i + 1).padStart(2, '0')}</span>` : ''}${escHtml(sec.titulo || '')}</h2><div>${md(sec.contenido || '')}</div></section>`).join('');
  const ats = Number(P.ats_score) > 0 ? `${Number(P.ats_score)}/100` : '';
  // El código DISC puede venir como perfil ("CD") o como puntajes ("D7-I3-S4-C10"):
  // en el segundo caso se arma con las dos dimensiones más altas del perfil natural.
  const _dc = String((P.disc && P.disc.codigo) || '');
  const _nat = (P.disc && P.disc.natural) || null;
  const disc = /^[DISC]{1,2}$/.test(_dc) ? _dc
    : (_nat && Object.values(_nat).some(v => v > 0)) ? Object.entries(_nat).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]).join('') : '';
  const discPat = (P.disc && P.disc.patron && P.disc.patron !== 'Sin evaluar') ? escHtml(String(P.disc.patron).split('—')[0].trim()) : '';
  const kMax = P.kostick_max ? [escHtml(P.kostick_max[0]), P.kostick_max[1]] : null;
  const indicador = (v, t) => v ? `<div class="ind"><b>${v}</b><span>${t}</span></div>` : '';

  // Estilos comunes a los tres niveles
  const base = `
      @page { size: A4; margin: 18mm 16mm 20mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { font-family: Arial, Helvetica, sans-serif; color: #0F172A; font-size: 10.5pt; line-height: 1.5; margin: 0; }
      h2 { font-size: 12.5pt; color: #1E3A8A; border-bottom: 1px solid #DBE3F0; padding-bottom: 3px; margin: 18px 0 8px; break-after: avoid; }
      h3, h4 { font-size: 11pt; margin: 12px 0 6px; color: #1E3A8A; }
      table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.5pt; }
      th, td { border: 1px solid #C9D3E0; padding: 4px 6px; text-align: left; vertical-align: top; }
      th { background: #EEF2FF; }
      blockquote { border-left: 3px solid #2563EB; margin: 8px 0; padding: 2px 10px; color: #333; }
      .cabecera { display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #2563EB; padding-bottom: 6px; margin-bottom: 14px; font-size: 9pt; color: #475569; }
      .cabecera svg { width: 6mm; height: 6mm; } .cabecera b { color: #0F172A; }
      .ind { border: 1px solid #DBE3F0; border-radius: 6px; padding: 8px 12px; min-width: 34mm; }
      .ind b { display: block; font-size: 15pt; color: #1E3A8A; } .ind span { font-size: 8.5pt; color: #64748B; }
      .pie { display: flex; align-items: center; gap: 10px; font-size: 8.5pt; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 10px; }
      .pie svg { width: 7mm; height: 7mm; flex-shrink: 0; }`;
  let estilos = base, inicio = '';

  if (plan === 'Esencial') {
    // Nivel 1 — Informe básico: encabezado sencillo, sin portada aparte.
    estilos += `
      .basico { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 10px; margin-bottom: 16px; }
      .basico .logo svg { height: 12mm; width: auto; display: block; }
      .basico .dat { text-align: right; font-size: 9pt; color: #475569; }
      .basico h1 { font-size: 16pt; margin: 0 0 2px; color: #0F172A; }
      h2 { color: #0F172A; border-bottom-color: #E2E8F0; }`;
    inicio = `
    <div class="basico"><div class="logo">${LOGO}</div>
      <div class="dat"><h1>Informe de Resultados</h1>Plan Esencial · ${nombre}<br>${cargo ? cargo + ' · ' : ''}${fecha}</div></div>`;
  } else if (plan === 'Profesional') {
    // Nivel 2 — Informe detallado: portada con datos e indicadores clave.
    estilos += `
      .portada { height: 255mm; display: flex; flex-direction: column; break-after: page; }
      .portada .logo svg { height: 18mm; width: auto; display: block; }
      .portada .cuerpo { margin-top: 55mm; }
      .portada .etiqueta { display: inline-block; font-size: 9pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #1E3A8A; border: 1.5px solid #2563EB; padding: 4px 10px; border-radius: 4px; }
      .portada h1 { font-size: 26pt; line-height: 1.15; margin: 12px 0 6px; }
      .portada .sub { font-size: 12pt; color: #475569; margin: 0 0 20px; }
      .portada dl { display: grid; grid-template-columns: 38mm 1fr; gap: 5px 10px; font-size: 10.5pt; margin: 0 0 18px; }
      .portada dt { color: #64748B; } .portada dd { margin: 0; font-weight: 700; }
      .inds { display: flex; gap: 10px; } .portada .pie { margin-top: auto; }`;
    inicio = `
    <div class="portada"><div class="logo">${LOGO}</div>
      <div class="cuerpo"><span class="etiqueta">Plan Profesional</span>
        <h1>Informe de Diagnóstico<br>Profesional</h1><p class="sub">Perfil integral, fortalezas, brechas y posicionamiento de mercado</p>
        <dl><dt>Participante</dt><dd>${nombre}</dd>${cargo ? `<dt>Cargo objetivo</dt><dd>${cargo}</dd>` : ''}${sector ? `<dt>Sector</dt><dd>${sector}</dd>` : ''}<dt>Fecha</dt><dd>${fecha}</dd></dl>
        <div class="inds">${indicador(ats, 'Puntaje ATS del CV')}${indicador(disc, 'Perfil DISC' + (discPat ? ' · ' + discPat : ''))}${kMax ? indicador(kMax[1] + '/9', 'Kostick · ' + kMax[0]) : ''}</div></div>
      <div class="pie">${ISO}<span>ATDC — Asistente de Transición y Desarrollo de Carrera · outplacement.atdc.app<br>Documento confidencial para uso de ${nombre}.</span></div></div>
    <div class="cabecera">${ISO}<span><b>Informe Profesional ATDC</b> · ${nombre} · ${fecha}</span></div>`;
  } else {
    // Nivel 3 — Informe premium: portada completa, indicadores, índice y sello del consultor.
    estilos += `
      .portada { height: 255mm; display: flex; flex-direction: column; break-after: page; }
      .portada .logo svg { height: 22mm; width: auto; display: block; }
      .portada .cuerpo { margin-top: 48mm; }
      .portada .etiqueta { display: inline-block; font-size: 9pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: linear-gradient(135deg,#2563EB,#7C3AED); padding: 5px 12px; border-radius: 4px; }
      .portada h1 { font-size: 30pt; line-height: 1.15; margin: 14px 0 6px; }
      .portada .sub { font-size: 13pt; color: #475569; margin: 0; }
      .portada .barra { height: 4px; width: 60mm; margin: 22px 0; background: linear-gradient(90deg,#2563EB,#7C3AED); border-radius: 2px; }
      .portada dl { display: grid; grid-template-columns: 38mm 1fr; gap: 6px 10px; font-size: 11pt; margin: 0 0 18px; }
      .portada dt { color: #64748B; } .portada dd { margin: 0; font-weight: 700; }
      .inds { display: flex; gap: 10px; } .ind { border-color: #C7D2FE; background: #F5F7FF; }
      .sello { margin-top: 16px; display: inline-flex; align-items: center; gap: 8px; font-size: 9.5pt; color: #4C1D95; background: #F3E8FF; border-radius: 20px; padding: 5px 12px; font-weight: 700; }
      .portada .pie { margin-top: auto; }
      .indice { break-after: page; } .indice h2 { border: none; font-size: 16pt; color: #0F172A; margin-top: 0; }
      .indice ol { list-style: none; padding: 0; margin: 10px 0 0; counter-reset: i; }
      .indice li { display: flex; gap: 12px; padding: 9px 0; border-bottom: 1px solid #E2E8F0; font-size: 11pt; }
      .indice li b { color: #7C3AED; width: 9mm; }
      h2 .n { color: #7C3AED; margin-right: 8px; }
      blockquote { border-left-color: #7C3AED; }`;
    inicio = `
    <div class="portada"><div class="logo">${LOGO}</div>
      <div class="cuerpo"><span class="etiqueta">Plan Premium</span>
        <h1>Informe Final<br>de Transición de Carrera</h1><p class="sub">Diagnóstico de empleabilidad y plan de acción</p>
        <div class="barra"></div>
        <dl><dt>Participante</dt><dd>${nombre}</dd>${cargo ? `<dt>Cargo objetivo</dt><dd>${cargo}</dd>` : ''}${sector ? `<dt>Sector</dt><dd>${sector}</dd>` : ''}<dt>Fecha</dt><dd>${fecha}</dd></dl>
        <div class="inds">${indicador(ats, 'Puntaje ATS del CV')}${indicador(disc, 'Perfil DISC' + (discPat ? ' · ' + discPat : ''))}${kMax ? indicador(kMax[1] + '/9', 'Kostick · ' + kMax[0]) : ''}</div>
        <div class="sello">✓ Revisado y aprobado por el consultor</div></div>
      <div class="pie">${ISO}<span>ATDC — Asistente de Transición y Desarrollo de Carrera · outplacement.atdc.app<br>Documento confidencial, preparado para uso exclusivo de ${nombre}.</span></div></div>
    <div class="indice"><div class="cabecera">${ISO}<span><b>Informe Final ATDC</b> · ${nombre} · ${fecha}</span></div>
      <h2>Contenido</h2><ol>${secciones.map((sec, i) => `<li><b>${String(i + 1).padStart(2, '0')}</b><span>${escHtml(sec.titulo || '')}</span></li>`).join('')}</ol></div>
    <div class="cabecera">${ISO}<span><b>Informe Final ATDC</b> · ${nombre}${cargo ? ' · ' + cargo : ''} · ${fecha}</span></div>`;
  }
  const titulo = plan === 'Esencial' ? 'Informe de Resultados' : plan === 'Profesional' ? 'Informe Profesional' : 'Informe Final';
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${titulo} ATDC — ${nombre}</title>
    <style>${estilos}</style></head><body>${inicio}
    ${secs}</body></html>`;
  return html;
  }
  function imprimir(htmlDoc, alFallar) {
    const fr = document.createElement('iframe');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(fr);
    fr.onload = () => {
      try { fr.contentWindow.focus(); fr.contentWindow.print(); }
      catch (e) { if (alFallar) alFallar(e); }
      setTimeout(() => fr.remove(), 60000);
    };
    fr.srcdoc = htmlDoc;
  }
  return { html, imprimir, md };
})();
