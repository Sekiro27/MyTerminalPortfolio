// Terminal Portfolio JavaScript
class TerminalPortfolio {
    constructor() {
        this.terminalInput = document.getElementById('terminalInput');
        this.terminalContent = document.getElementById('terminalContent');
        this.cursor = document.getElementById('cursor');
        this.bootSequence = document.getElementById('bootSequence');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isProcessing = false;
        
        this.commands = {
            'help': () => this.showHelp(),
            'whoami': () => this.showWhoami(),
            'ls projects/': () => this.showProjects(),
            'ls': () => this.showProjects(),
            'skills --list': () => this.showSkills(),
            'skills': () => this.showSkills(),
            'contact --help': () => this.showContact(),
            'contact': () => this.showContact(),
            'clear': () => this.clearTerminal(),
            'exit': () => this.exitTerminal(),
            'restart': () => this.restartTerminal(),
            'about': () => this.showWhoami(),
            'projects': () => this.showProjects(),
            'resume': () => this.showWhoami()
        };
        
        this.init();
    }
    
    init() {
        // Focus input on load
        this.terminalInput.focus();
        
        // Boot sequence animation
        setTimeout(() => {
            this.bootSequence.style.opacity = '1';
            setTimeout(() => {
                this.bootSequence.style.display = 'none';
                this.showWelcome();
            }, 2500);
        }, 100);
        
        // Event listeners
        this.terminalInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
        
        // Navigation buttons
        this.setupNavigationButtons();
        
        // Terminal controls (only close button works)
        this.setupTerminalControls();
        
        // Prevent context menu on terminal
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.terminal-container')) {
                e.preventDefault();
            }
        });
        
        // Add typewriter effect to cursor
        this.startCursorBlink();
    }
    
    handleKeyPress(e) {
        if (this.isProcessing) return;
        
        const key = e.key;
        const value = this.terminalInput.value.trim();
        
        switch (key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand(value);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.autoComplete(value);
                break;
            case 'Escape':
                this.terminalInput.value = '';
                break;
        }
    }
    
    handleDocumentClick(e) {
        // Focus input when clicking on terminal
        if (e.target.closest('.terminal-container')) {
            this.terminalInput.focus();
        }
    }
    
    executeCommand(command) {
        if (!command.trim()) return;
        
        this.isProcessing = true;
        
        // Add command to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addTerminalLine(`$ ${command}`, 'command');
        
        // Execute command
        const commandLower = command.toLowerCase().trim();
        
        if (this.commands[commandLower]) {
            setTimeout(() => {
                this.commands[commandLower]();
                this.isProcessing = false;
            }, 300);
        } else {
            setTimeout(() => {
                // Primero revisar si es un easter egg
                if (!this.checkEasterEggs(command)) {
                    // Si no es easter egg, mostrar error
                    this.addTerminalLine(`Command not found: ${command}`, 'error');
                    this.addTerminalLine('Type "help" for available commands', 'info');
                }
                this.isProcessing = false;
            }, 300);
        }
        
        // Clear input
        this.terminalInput.value = '';
    }
    
    navigateHistory(direction) {
        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--;
        } else if (direction === 1 && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
        } else if (direction === 1 && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.terminalInput.value = '';
            return;
        }
        
        if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length) {
            this.terminalInput.value = this.commandHistory[this.historyIndex];
        }
    }
    
    autoComplete(partialCommand) {
        const availableCommands = Object.keys(this.commands);
        const matches = availableCommands.filter(cmd => cmd.startsWith(partialCommand.toLowerCase()));
        
        if (matches.length === 1) {
            this.terminalInput.value = matches[0];
        } else if (matches.length > 1) {
            this.addTerminalLine('Available commands:', 'info');
            matches.forEach(cmd => {
                this.addTerminalLine(`  ${cmd}`, 'info');
            });
        }
    }
    
    addTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.terminalContent.appendChild(line);
        this.scrollToBottom();
    }
    
    addContent(contentId) {
        const content = document.getElementById(contentId);
        if (content) {
            const clonedContent = content.cloneNode(true);
            clonedContent.style.display = 'block';
            clonedContent.classList.remove('hidden-content');
            this.terminalContent.appendChild(clonedContent);
            this.scrollToBottom();
        }
    }
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    showWelcome() {
        this.addTerminalLine('Welcome to Josué Moreno\'s Portfolio Terminal', 'success');
        this.addTerminalLine('System ready. Type "help" for available commands or click top buttons for surfing.', 'info');
        this.addTerminalLine('');
    }
    
    showHelp() {
        this.addContent('help-content');
    }
    
    showWhoami() {
        this.addContent('whoami-content');
    }
    
    showProjects() {
        this.addContent('projects-content');
        this.setupProjectInteractions();
    }
    
    showSkills() {
        this.addContent('skills-content');
        this.animateSkills();
    }
    
    showContact() {
        this.addContent('contact-content');
    }
    
    clearTerminal() {
        this.terminalContent.innerHTML = '';
        this.addTerminalLine('Terminal cleared.', 'info');
        this.addTerminalLine('');
    }
    
    exitTerminal() {
        this.addTerminalLine('Shutting down terminal...', 'warning');
        setTimeout(() => {
            this.addTerminalLine('Goodbye! Refresh to restart.', 'success');
            this.terminalInput.disabled = true;
            this.cursor.style.display = 'none';
        }, 1000);
    }
    
    restartTerminal() {
        location.reload();
    }
    
    setupProjectInteractions() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                // Project click functionality removed - no output displayed
            });
        });
    }
    
    animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.animation = 'fadeIn 0.3s ease-in forwards';
            }, index * 50);
        });
    }
    
    setupNavigationButtons() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                if (command) {
                    // Visual feedback
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    // Execute command
                    this.executeCommand(command);
                }
            });
        });
    }
    
    setupTerminalControls() {
        const closeBtn = document.querySelector('.control.close');
        const minimizeBtn = document.querySelector('.control.minimize');
        const maximizeBtn = document.querySelector('.control.maximize');
        
        // Close button works
        closeBtn.addEventListener('click', () => {
            this.showCloseDialog();
        });
        
        // Minimize and maximize buttons appear clickable but do nothing
        minimizeBtn.addEventListener('click', (e) => {
            // Visual feedback only
            minimizeBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                minimizeBtn.style.transform = '';
            }, 150);
        });
        
        maximizeBtn.addEventListener('click', (e) => {
            // Visual feedback only
            maximizeBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                maximizeBtn.style.transform = '';
            }, 150);
        });
    }
    
    showCloseDialog() {
        const terminalContent = document.getElementById('terminalContent');
        const dialog = document.createElement('div');
        dialog.className = 'close-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <p>Are you sure you want to close the terminal?</p>
                <div class="dialog-buttons">
                    <button class="dialog-btn confirm">Yes</button>
                    <button class="dialog-btn cancel">No</button>
                </div>
            </div>
        `;
        
        terminalContent.appendChild(dialog);
        
        const confirmBtn = dialog.querySelector('.confirm');
        const cancelBtn = dialog.querySelector('.cancel');
        
        confirmBtn.addEventListener('click', () => {
            window.close();
            // Fallback for browsers that don't allow window.close()
            window.location.href = 'about:blank';
        });
        
        cancelBtn.addEventListener('click', () => {
            dialog.remove();
        });
    }
    
    startCursorBlink() {
        setInterval(() => {
            this.cursor.style.opacity = this.cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
    
    // Easter eggs
    checkEasterEggs(command) {
        const easterEggs = {
            'sudo': () => {
                this.addTerminalLine('sudo: permission denied', 'error');
                this.addTerminalLine('Just kidding! You have all permissions here.', 'success');
            },
            'matrix': () => {
                this.addTerminalLine('Wake up, Neo...', 'success');
                this.addTerminalLine('The Matrix has you...', 'info');
                this.addTerminalLine('Follow the white rabbit.', 'info');
            },
            'hello world': () => {
                this.addTerminalLine('Hello, World!', 'success');
                this.addTerminalLine('Welcome to the terminal!', 'info');
            },
            'date': () => {
                const now = new Date();
                this.addTerminalLine(now.toString(), 'info');
            },
            'pwd': () => {
                this.addTerminalLine('/home/josue/portfolio', 'info');
            },
            'ls -la': () => {
                this.addTerminalLine('drwxr-xr-x  2 josue josue 4096 Dec  6 15:30 .', 'info');
                this.addTerminalLine('drwxr-xr-x  3 josue josue 4096 Dec  6 15:25 ..', 'info');
                this.addTerminalLine('-rw-r--r--  1 josue josue  8234 Dec  6 15:30 index.html', 'info');
                this.addTerminalLine('-rw-r--r--  1 josue josue  5678 Dec  6 15:30 styles.css', 'info');
                this.addTerminalLine('-rw-r--r--  1 josue josue 12345 Dec  6 15:30 script.js', 'info');
            }
        };
        
        const commandLower = command.toLowerCase().trim();
        if (easterEggs[commandLower]) {
            easterEggs[commandLower]();
            return true;
        }
        return false;
    }
}


// Initialize the terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
    
    // Add some ambient effects
    createAmbientEffects();
});

function createAmbientEffects() {
    // Add subtle glitch effect randomly
    setInterval(() => {
        if (Math.random() > 0.60) {
            const terminal = document.querySelector('.terminal-container');
            terminal.style.animation = 'glitch 0.5s ease-in-out';
            setTimeout(() => {
                terminal.style.animation = '';
            }, 500);
        }
    }, 5000);
    
    // Add typing sound effect simulation (visual feedback)
    const terminalInput = document.getElementById('terminalInput');
    let typingTimeout;
    
    terminalInput.addEventListener('input', () => {
        clearTimeout(typingTimeout);
        document.body.classList.add('typing');
        
        typingTimeout = setTimeout(() => {
            document.body.classList.remove('typing');
        }, 500);
    });
}

// Add CSS for dialog and typing effect
const additionalCSS = `
.close-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--terminal-bg);
    border: 2px solid var(--terminal-text);
    border-radius: 8px;
    padding: 20px;
    z-index: 1000;
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.5);
}

.dialog-content p {
    margin-bottom: 20px;
    color: var(--terminal-text);
}

.dialog-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.dialog-btn {
    background: var(--terminal-text);
    color: var(--terminal-bg);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Fira Code', monospace;
    font-weight: 600;
    transition: all 0.2s;
}

.dialog-btn:hover {
    background: var(--terminal-accent);
    transform: scale(1.05);
}

.dialog-btn.cancel {
    background: var(--terminal-error);
}

.typing .terminal-container {
    box-shadow: 0 0 40px rgba(0, 255, 65, 0.3);
}

.terminal-line.command {
    color: var(--terminal-accent);
    font-weight: 600;
}

.terminal-line.error {
    color: var(--terminal-error);
    animation: glitch 0.3s ease-in-out;
}

.terminal-line.info {
    color: var(--terminal-text-dim);
}

.terminal-line.success {
    color: var(--terminal-accent);
}

.terminal-line.warning {
    color: var(--terminal-warning);
}

.maximized {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
}

@media (max-width: 768px) {
    .close-dialog {
        width: 90%;
        max-width: 300px;
    }
    
    .dialog-buttons {
        flex-direction: column;
    }
    
    .dialog-btn {
        width: 100%;
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);
