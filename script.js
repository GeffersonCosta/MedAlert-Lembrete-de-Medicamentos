document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const medicationList = document.getElementById('list');

    // Carregar o som de alarme
    const alarmSound = new Audio('caminho/para/seu/arquivo/som.mp3');

    // Carregar medicamentos do localStorage ao iniciar a página
    loadMedications();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const medicationName = document.getElementById('medication-name').value;
        const dosage = document.getElementById('dosage').value;
        const time = document.getElementById('time').value;

        const medication = { medicationName, dosage, time };

        // Enviar dados para o servidor
        fetch('http://localhost:3000/add-medication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medication)
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Exibe a resposta do servidor no console
            addMedication(medication);
            saveMedication(medication); // Salvar no localStorage
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
        });

        form.reset();
    });

    function addMedication({ medicationName, dosage, time }) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${medicationName} - ${dosage} às ${time}</span>
            <button onclick="deleteMedication(this)">Excluir</button>
        `;

        medicationList.appendChild(listItem);
        setReminder(medicationName, dosage, time);
    }

    window.deleteMedication = (button) => {
        const listItem = button.parentElement;
        const medicationText = listItem.querySelector('span').textContent;
        
        const [medicationPart, timePart] = medicationText.split(' às ');
        const [medicationName, dosage] = medicationPart.split(' - ');

        // Remover o item da página
        listItem.remove();

        // Remover o item do localStorage
        removeMedication(medicationName.trim(), dosage.trim(), timePart.trim());
    };

    function setReminder(name, dosage, time) {
        const [hours, minutes] = time.split(':');
        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        if (reminderTime > now) {
            const timeout = reminderTime - now;
            setTimeout(() => {
                alert(`Hora de tomar ${name} - ${dosage}`);
                alarmSound.play(); // Tocar som do alarme
            }, timeout);
        }
    }

    function saveMedication(medication) {
        let medications = JSON.parse(localStorage.getItem('medications')) || [];
        medications.push(medication);
        localStorage.setItem('medications', JSON.stringify(medications));
    }

    function loadMedications() {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        medications.forEach(addMedication);
    }

    function removeMedication(name, dosage, time) {
        let medications = JSON.parse(localStorage.getItem('medications')) || [];
        
        // Filtrar os medicamentos removendo aquele que corresponde exatamente ao item deletado
        medications = medications.filter(med => 
            !(med.medicationName === name && med.dosage === dosage && med.time === time)
        );

        // Atualizar o localStorage
        localStorage.setItem('medications', JSON.stringify(medications));
    }
});
