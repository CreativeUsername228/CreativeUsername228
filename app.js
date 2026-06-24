const AppState = { step: 0, raspunsuri: { dispozitie: null, dorinta: null, data: null, loc: null } };
const container = document.getElementById('app');

// Funcție pentru inimioare (rămâne neschimbată)
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 800);

function render() {
    container.innerHTML = '';
    switch(AppState.step) {
        case 0: ecranDispozitie(); break;
        case 1: ecranDorinte(); break;
        case 2: ecranScrisoare(); break;
        case 3: ecranPlanificare(); break;
    }
}

// ... funcțiile ecranDispozitie și ecranDorinte rămân exact ca înainte ...
function ecranDispozitie() {
    container.innerHTML = `<h2>How do you feel today? (1-10)</h2>`;
    const grup = document.createElement('div');
    grup.className = 'btn-container';
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn'; btn.textContent = i;
        btn.onclick = () => { AppState.raspunsuri.dispozitie = i; AppState.step = 1; render(); };
        grup.appendChild(btn);
    }
    container.appendChild(grup);
}

function ecranDorinte() {
    container.innerHTML = `<h2>Ce ți-ai dori la moment?</h2>`;
    const area = document.createElement('textarea');
    area.className = 'input-text'; area.rows = 4;
    const btn = document.createElement('button');
    btn.className = 'btn-trimite'; btn.textContent = 'Trimite';
    btn.onclick = async () => {
        if(area.value.trim()){
            AppState.raspunsuri.dorinta = area.value;
            await fetch("https://formspree.io/f/xrewbwvb", {
                method: "POST", headers: {"Content-Type": "application/json"},
                body: JSON.stringify({Dispozitie: AppState.raspunsuri.dispozitie, Mesaj: area.value})
            });
            AppState.step = 2; render();
        }
    };
    container.append(area, btn);
}

function ecranScrisoare() {
    const mesaj = `Dear Vica,<br><br>${AppState.raspunsuri.dispozitie >= 8 ? "Mă bucur enorm că ur mood ii " + AppState.raspunsuri.dispozitie +"/10! Sper să-ți fac ziua și mai frumoasă." : "Îmi pare rău că dispoziția de azi e doar de " + AppState.raspunsuri.dispozitie + ", that sucks, dar sunt aici să te fac să zâmbești."}<br><br>Să știi că indiferent de situații eu sunt mereu gata să te ascult, have a great day în continuare!❤️🥰`;
    
    container.innerHTML = `<div class="scrisoare-text">${mesaj}</div>`;
    
    const btnDate = document.createElement('button');
    btnDate.className = 'btn-trimite';
    btnDate.style.marginTop = '20px';
    btnDate.textContent = 'Vrei sa planificam un date? =D';
    
    const hint = document.createElement('p');
    hint.textContent = 'click';
    hint.style.fontSize = '12px';
    hint.style.color = '#888';
    
    btnDate.onclick = () => { AppState.step = 3; render(); };
    container.append(btnDate, hint);
}

function ecranPlanificare() {
    container.innerHTML = `<h2>Hai să plănuim date-ul!</h2>`;
    
    // State intern pentru calendar
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;

    const wrapper = document.createElement('div');
    wrapper.className = 'calendar-wrapper';

    function renderCalendar() {
        wrapper.innerHTML = ''; // Reset
        
        const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
        
        // Navigare
        const nav = document.createElement('div');
        nav.className = 'cal-nav';
        nav.innerHTML = `<button>&lt;</button> <span>${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}</span> <button>&gt;</button>`;
        nav.children[0].onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
        nav.children[2].onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };
        wrapper.appendChild(nav);

        // Header zile
        const header = document.createElement('div');
        header.className = 'days-header';
        header.innerHTML = '<div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>';
        wrapper.appendChild(header);

        // Grid zile
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // Ziua săptămânii (0=Duminică)
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        // Ajustare pentru Luni-Duminică (JS începe cu Duminică=0)
        const offset = (firstDay === 0) ? 6 : firstDay - 1;

        for (let i = 0; i < offset; i++) grid.appendChild(document.createElement('div')); // Celule goale
        
        for (let i = 1; i <= daysInMonth; i++) {
            const btn = document.createElement('button');
            btn.className = 'day-btn';
            btn.textContent = i;
            btn.onclick = () => {
                document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedDate = `${i} ${monthNames[currentDate.getMonth()]}`;
            };
            grid.appendChild(btn);
        }
        wrapper.appendChild(grid);
    }

    // Selectare Oră
    const timeGrid = document.createElement('div');
    timeGrid.className = 'time-grid';
    const hours = ["14:00", "16:00", "18:00", "19:00", "20:00", "21:00"];
    hours.forEach(h => {
        const btn = document.createElement('button');
        btn.className = 'time-btn';
        btn.textContent = h;
        btn.onclick = () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTime = h;
        };
        timeGrid.appendChild(btn);
    });

    // Locații
    const locatii = ["In parcul de jos", "Sa ne plimbam prin oras", "La sushi", "La Salat", "La New Era"];
    const select = document.createElement('select');
    select.className = 'input-text';
    locatii.forEach(l => { const opt = document.createElement('option'); opt.value = l; opt.textContent = l; select.appendChild(opt); });

    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'btn-trimite';
    btnConfirm.textContent = 'Confirmă planul! ❤️';
    btnConfirm.onclick = async () => {
        if (!selectedDate || !selectedTime) { alert("Alege o zi și o oră!"); return; }
        await fetch("https://formspree.io/f/xrewbwvb", {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({Tip: "PLANIFICARE", Data: selectedDate, Ora: selectedTime, Locatie: select.value})
        });
        container.innerHTML = `<h2>Super! Abia aștept! ❤️</h2>`;
    };

    renderCalendar();
    container.append(wrapper, timeGrid, document.createElement('br'), select, btnConfirm);
}

render();