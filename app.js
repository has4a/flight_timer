class FlightTimer {
    constructor() {
        this.engineBtn = document.getElementById('engineBtn');
        this.flightBtn = document.getElementById('flightBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.logsContainer = document.getElementById('logsContainer');
        
        this.engineRunning = false;
        this.isFlying = false;
        this.engineStartTime = null;
        this.currentFlightStart = null;
        this.flightTimes = [];
        this.logs = [];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.engineBtn.addEventListener('click', () => this.toggleEngine());
        this.flightBtn.addEventListener('click', () => this.toggleFlight());
        this.saveBtn.addEventListener('click', () => this.saveLogs());
    }
    
    formatDuration(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    addLog(message) {
        const now = new Date();
        const logEntry = `${now.toLocaleTimeString()} - ${message}`;
        this.logs.push(logEntry);
        
        const logElement = document.createElement('div');
        logElement.textContent = logEntry;
        this.logsContainer.appendChild(logElement);
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
    }
    
    toggleEngine() {
        if (!this.engineRunning) {
            this.engineStartTime = new Date();
            this.engineRunning = true;
            this.engineBtn.textContent = 'Engine OFF';
            this.engineBtn.classList.add('running');
            this.flightBtn.disabled = false;
            this.addLog(`Motor zapnutý: ${this.engineStartTime.toLocaleTimeString()}`);
        } else {
            const endTime = new Date();
            const duration = endTime - this.engineStartTime;
            this.addLog(`Motor vypnutý: ${endTime.toLocaleTimeString()}`);
            this.addLog(`Celkový čas chodu motora: ${this.formatDuration(duration)}`);
            
            // Výpočet štatistík
            const totalFlightTime = this.flightTimes.reduce((acc, flight) => acc + flight.duration, 0);
            const avgFlightTime = this.flightTimes.length > 0 ? totalFlightTime / this.flightTimes.length : 0;
            
            this.addLog('=== ŠTATISTIKY LETOV ===');
            this.addLog(`Počet letov: ${this.flightTimes.length}`);
            this.addLog(`Celkový čas motora: ${this.formatDuration(duration)}`);
            this.addLog(`Celkový čas vo vzduchu: ${this.formatDuration(totalFlightTime)}`);
            if (this.flightTimes.length > 0) {
                this.addLog(`Priemerný čas letu: ${this.formatDuration(avgFlightTime)}`);
            }
            this.addLog(`Čas na zemi (motor bežal): ${this.formatDuration(duration - totalFlightTime)}`);
            
            this.engineRunning = false;
            this.engineBtn.textContent = 'Engine ON';
            this.engineBtn.classList.remove('running');
            this.flightBtn.disabled = true;
            
            if (this.isFlying) {
                this.toggleFlight();
            }
        }
    }
    
    toggleFlight() {
        if (!this.isFlying) {
            this.currentFlightStart = new Date();
            this.isFlying = true;
            this.flightBtn.textContent = 'Take ON';
            this.addLog(`Vzlet: ${this.currentFlightStart.toLocaleTimeString()}`);
        } else {
            const endTime = new Date();
            const duration = endTime - this.currentFlightStart;
            this.flightTimes.push({
                start: this.currentFlightStart,
                end: endTime,
                duration: duration
            });
            this.addLog(`Pristátie: ${endTime.toLocaleTimeString()}`);
            this.addLog(`Dĺžka letu: ${this.formatDuration(duration)}`);
            this.isFlying = false;
            this.flightBtn.textContent = 'Take OFF';
        }
    }
    
    saveLogs() {
        if (this.logs.length === 0) return;
        
        const content = this.logs.join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flight_logs_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicializácia aplikácie
document.addEventListener('DOMContentLoaded', () => {
    new FlightTimer();
});
