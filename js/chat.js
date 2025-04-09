// Base de datos de preguntas frecuentes
const faqDatabase = {
    "habitaciones": {
        keywords: ["habitación", "habitaciones", "cuarto", "cuartos", "cama", "camas", "precio", "tarifa"],
        response: "Ofrecemos tres tipos de habitaciones:\n1. Habitación Estándar ($120/noche)\n2. Suite Deluxe ($250/noche)\n3. Villa Presidencial ($450/noche)",
        quickReplies: [
            "¿Cuáles son los servicios incluidos?",
            "¿Tienen vista al mar?",
            "¿Puedo hacer una reserva?"
        ]
    },
    "servicios": {
        keywords: ["servicio", "servicios", "spa", "piscina", "restaurante", "wifi", "internet"],
        response: "Nuestros servicios incluyen:\n- Restaurante gourmet\n- Spa completo\n- Piscina infinita\n- Wi-Fi de alta velocidad\n- Servicio de conserjería 24/7",
        quickReplies: [
            "¿Los servicios son gratuitos?",
            "¿Necesito reservar el spa?",
            "¿Tienen servicio a la habitación?"
        ]
    },
    "ubicacion": {
        keywords: ["ubicación", "dirección", "dónde", "lugar", "mapa"],
        response: "Nos encontramos en Av. del Mar 1234, Playa Hermosa, Lima, Perú. Estamos frente al mar con acceso directo a la playa.",
        quickReplies: [
            "¿Cómo llego desde el aeropuerto?",
            "¿Tienen estacionamiento?",
            "¿Están cerca del centro?"
        ]
    },
    "contacto": {
        keywords: ["contacto", "teléfono", "email", "correo", "llamar", "escribir"],
        response: "Puede contactarnos por:\n- Teléfono: +52 123 456 7890\n- Email: info@oceanviewhotel.com",
        quickReplies: [
            "Quiero hablar por WhatsApp",
            "¿Tienen redes sociales?",
            "¿Atienden 24/7?"
        ]
    },
    "reservas": {
        keywords: ["reserva", "reservar", "booking", "disponibilidad", "fecha"],
        response: "Para hacer una reserva puede:\n1. Usar nuestro sistema de reservas online\n2. Llamarnos al +52 123 456 7890\n3. Enviarnos un WhatsApp",
        quickReplies: [
            "Quiero hacer una reserva por WhatsApp",
            "¿Cuál es la política de cancelación?",
            "¿Necesito tarjeta de crédito?"
        ]
    }
};

// Función para encontrar la mejor respuesta basada en la pregunta
function findBestResponse(question) {
    question = question.toLowerCase();
    let bestMatch = {
        response: "Lo siento, no entiendo tu pregunta. ¿Podrías reformularla? También puedes contactarnos directamente por WhatsApp.",
        quickReplies: [
            "¿Qué habitaciones tienen?",
            "¿Qué servicios ofrecen?",
            "¿Dónde están ubicados?"
        ],
        score: 0
    };

    for (let category in faqDatabase) {
        const keywords = faqDatabase[category].keywords;
        let score = 0;
        
        keywords.forEach(keyword => {
            if (question.includes(keyword)) {
                score++;
            }
        });

        if (score > bestMatch.score) {
            bestMatch = {
                response: faqDatabase[category].response,
                quickReplies: faqDatabase[category].quickReplies,
                score: score
            };
        }
    }

    return bestMatch;
}

// Función para simular el efecto de escritura
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.innerHTML = '';
    const typing = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
}

// Función para agregar mensaje al chat
function addMessage(message, isUser = false, quickReplies = null) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const icon = document.createElement('i');
    icon.className = isUser ? 'fas fa-user' : 'fas fa-hotel';
    
    const textElement = document.createElement('p');
    messageContent.appendChild(icon);
    messageContent.appendChild(textElement);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    if (isUser) {
        textElement.textContent = message;
    } else {
        typeWriter(textElement, message);
    }

    if (quickReplies && !isUser) {
        setTimeout(() => {
            const quickRepliesDiv = document.createElement('div');
            quickRepliesDiv.className = 'quick-replies';
            quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'quick-reply-button';
                button.textContent = reply;
                button.onclick = () => handleQuickReply(reply);
                quickRepliesDiv.appendChild(button);
            });
            chatMessages.appendChild(quickRepliesDiv);
        }, message.length * 30 + 500); // Esperar a que termine la animación de escritura
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para manejar respuestas rápidas
function handleQuickReply(reply) {
    addMessage(reply, true);
    setTimeout(() => {
        const response = findBestResponse(reply);
        addMessage(response.response, false, response.quickReplies);
    }, 500);
}

// Función para manejar el envío de mensajes
function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, true);
        input.value = '';
        
        setTimeout(() => {
            const response = findBestResponse(message);
            addMessage(response.response, false, response.quickReplies);
        }, 500);
    }
}

// Función para abrir/cerrar el chat
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.toggle('open');
}

// Función para abrir WhatsApp
function openWhatsApp() {
    window.open('https://wa.me/521234567890', '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-button');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');

    chatButton.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Mensaje inicial
    setTimeout(() => {
        addMessage("¡Hola! Soy el asistente virtual de Ocean View Hotel. ¿En qué puedo ayudarte hoy?", false, [
            "¿Qué habitaciones tienen?",
            "¿Qué servicios ofrecen?",
            "¿Dónde están ubicados?"
        ]);
    }, 500);
}); 