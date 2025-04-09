// Sistema de reservas
class BookingSystem {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeDatePickers();
        this.mercadoPago = new MercadoPagoIntegration();
    }

    initializeElements() {
        this.bookingForm = document.getElementById('booking-form');
        this.checkInInput = document.getElementById('check-in');
        this.checkOutInput = document.getElementById('check-out');
        this.roomTypeSelect = document.getElementById('room-type');
        this.guestsSelect = document.getElementById('guests');
        this.totalPriceElement = document.getElementById('total-price');
        this.paymentMethodSelect = document.getElementById('payment-method');
    }

    initializeEventListeners() {
        this.checkInInput?.addEventListener('change', () => this.updateTotalPrice());
        this.checkOutInput?.addEventListener('change', () => this.updateTotalPrice());
        this.roomTypeSelect?.addEventListener('change', () => this.updateTotalPrice());
        this.guestsSelect?.addEventListener('change', () => this.updateTotalPrice());

        this.bookingForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processBooking();
        });
    }

    initializeDatePickers() {
        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        this.checkInInput.min = today;
        this.checkOutInput.min = today;

        // Actualizar fecha mínima de salida cuando se selecciona fecha de entrada
        this.checkInInput.addEventListener('change', () => {
            this.checkOutInput.min = this.checkInInput.value;
            if (this.checkOutInput.value < this.checkInInput.value) {
                this.checkOutInput.value = this.checkInInput.value;
            }
        });
    }

    calculateNights() {
        const checkIn = new Date(this.checkInInput.value);
        const checkOut = new Date(this.checkOutInput.value);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    }

    getRoomPrice() {
        // Precios base (ej. para 1-2 personas)
        const basePrices = {
            'standard': 120,
            'deluxe': 250,
            'presidential': 450
        };
        return basePrices[this.roomTypeSelect.value] || 0;
    }

    getGuestCount() {
        if (!this.guestsSelect) return { adults: 1, children: 0, total: 1 }; // Default if selector not found
        
        const selectedOption = this.guestsSelect.value; // e.g., "2 Adultos, 1 Niño"
        let adultCount = 0;
        let childCount = 0;

        // Parsear la cadena de texto para obtener números
        const adultsMatch = selectedOption.match(/(\d+)\s*Adulto/i); // Case-insensitive
        const childrenMatch = selectedOption.match(/(\d+)\s*Niño/i); // Case-insensitive

        if (adultsMatch) adultCount = parseInt(adultsMatch[1], 10);
        if (childrenMatch) childCount = parseInt(childrenMatch[1], 10);
        
        // Si no se encuentran adultos (ej. "1 Niño" - improbable pero por si acaso), asumir 0
        // Si no se encuentra ninguna coincidencia, asumir 1 adulto por defecto
        if (adultCount === 0 && childCount === 0) {
            adultCount = 1; 
        }

        return { adults: adultCount, children: childCount, total: adultCount + childCount };
    }

    updateTotalPrice() {
        const nights = this.calculateNights();
        const pricePerNightBase = this.getRoomPrice();
        const guestInfo = this.getGuestCount();

        // --- Lógica de Cargo Adicional (¡¡EJEMPLO!!) ---
        // ¡¡POR FAVOR, AJUSTA ESTOS VALORES A TU MODELO DE PRECIOS REAL!!
        let additionalGuestCharge = 0;
        const baseOccupancy = 2; // Número de huéspedes incluidos en el precio base
        const chargePerAdditionalAdult = 30; // Ejemplo: S/ 30 extra por adulto > baseOccupancy
        const chargePerChild = 15;          // Ejemplo: S/ 15 extra por niño

        // Calcular adultos adicionales
        if (guestInfo.adults > baseOccupancy) {
            additionalGuestCharge += (guestInfo.adults - baseOccupancy) * chargePerAdditionalAdult;
        }
        
        // Calcular niños (asumiendo que siempre tienen cargo extra si están presentes)
        // O podrías incluirlos en la baseOccupancy si lo deseas.
        if (guestInfo.children > 0) {
            // Ajusta esta lógica si los niños solo cuentan si exceden la baseOccupancy total
             additionalGuestCharge += guestInfo.children * chargePerChild;
        }
        // --- Fin Lógica de Ejemplo --- 

        const totalNightlyRate = pricePerNightBase + additionalGuestCharge;
        const total = nights * totalNightlyRate;
        
        if (this.totalPriceElement) {
            // Mostrar S/ 0.00 si las noches son 0
            const displayTotal = nights > 0 ? total : 0;
            this.totalPriceElement.textContent = `S/ ${displayTotal.toFixed(2)}`;
        }
    }

    async processBooking() {
        const nights = this.calculateNights();
        const pricePerNightBase = this.getRoomPrice();
        const guestInfo = this.getGuestCount();
        let additionalGuestCharge = 0;
        const baseOccupancy = 2;
        const chargePerAdditionalAdult = 30;
        const chargePerChild = 15;
        if (guestInfo.adults > baseOccupancy) {
            additionalGuestCharge += (guestInfo.adults - baseOccupancy) * chargePerAdditionalAdult;
        }
        if (guestInfo.children > 0) {
            additionalGuestCharge += guestInfo.children * chargePerChild;
        }
        const finalTotal = nights * (pricePerNightBase + additionalGuestCharge);
        
        const bookingData = {
            checkIn: this.checkInInput.value,
            checkOut: this.checkOutInput.value,
            guests: this.guestsSelect.value,
            roomType: this.roomTypeSelect.value,
            nights: nights,
            totalPrice: finalTotal > 0 ? finalTotal : 0
        };
        
        if (!bookingData.checkIn || !bookingData.checkOut) {
            this.showErrorModal("Por favor, seleccione fecha de llegada y salida.");
            return;
        }
        
        const checkInDate = new Date(bookingData.checkIn + 'T00:00:00');
        const checkOutDate = new Date(bookingData.checkOut + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            this.showErrorModal("La fecha de llegada no puede ser anterior a hoy.");
            return;
        }

        if (checkOutDate <= checkInDate) {
            this.showErrorModal("La fecha de salida debe ser posterior a la fecha de llegada.");
            return;
        }

        if (bookingData.nights <= 0) {
            this.showErrorModal("Las fechas seleccionadas no son válidas.");
            return; 
        }

        try {
            this.showPaymentOptions(bookingData);
        } catch (error) {
            console.error('Error al procesar la reserva:', error);
            this.showBookingError();
        }
    }

    showErrorModal(message) {
        const errorModal = document.createElement('div');
        errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        errorModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <h3 class="text-xl font-bold text-hotel-dark mb-4">Atención</h3>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <button class="bg-hotel-accent hover:bg-hotel-primary text-white py-2 px-6 rounded-lg transition duration-300">
                        Entendido
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(errorModal);
        
        errorModal.querySelector('button').addEventListener('click', () => {
            errorModal.remove();
        });
    }

    showPaymentOptions(bookingData) {
        const paymentModal = document.createElement('div');
        paymentModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        paymentModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-hotel-dark mb-4">Confirmar Reserva</h3>
                <div class="space-y-2 mb-6">
                    <p><strong>Check-in:</strong> ${bookingData.checkIn}</p>
                    <p><strong>Check-out:</strong> ${bookingData.checkOut}</p>
                    <p><strong>Huéspedes:</strong> ${bookingData.guests}</p>
                    <p><strong>Tipo de habitación:</strong> ${bookingData.roomType}</p>
                    <p><strong>Noches:</strong> ${bookingData.nights}</p>
                    <p><strong>Total:</strong> S/ ${bookingData.totalPrice.toFixed(2)}</p>
                </div>
                <div class="mb-6">
                    <label class="block text-hotel-dark font-medium mb-2">Método de Pago</label>
                    <select id="payment-method" class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hotel-accent focus:border-transparent bg-hotel-light">
                        <option value="mercadopago">Mercado Pago</option>
                        <option value="credit_card">Tarjeta de Crédito</option>
                        <option value="cash">Pago en Efectivo</option>
                    </select>
                </div>
                <div id="wallet_container" class="mb-6"></div>
                <div class="flex space-x-4">
                    <button id="confirm-payment" class="flex-1 bg-hotel-accent hover:bg-hotel-primary text-white py-3 px-6 rounded-lg transition duration-300">
                        Pagar ahora
                    </button>
                    <button id="cancel-payment" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg transition duration-300">
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(paymentModal);
        
        paymentModal.querySelector('#confirm-payment').addEventListener('click', async () => {
            const paymentMethod = paymentModal.querySelector('#payment-method').value;
            
            if (paymentMethod === 'mercadopago') {
                try {
                    const preferenceId = await this.mercadoPago.createPayment(bookingData);
                    
                    await this.mercadoPago.openCheckout(preferenceId);
                    
                    paymentModal.remove();
                } catch (error) {
                    console.error('Error al procesar el pago con Mercado Pago:', error);
                    this.showPaymentError();
                    paymentModal.remove();
                }
            } else {
                this.showBookingConfirmation(bookingData);
                paymentModal.remove();
            }
        });
        
        paymentModal.querySelector('#cancel-payment').addEventListener('click', () => {
            paymentModal.remove();
        });
    }

    showBookingConfirmation(bookingData) {
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        confirmationModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-hotel-dark mb-4">¡Reserva Confirmada!</h3>
                <div class="space-y-2 mb-6">
                    <p><strong>Check-in:</strong> ${bookingData.checkIn}</p>
                    <p><strong>Check-out:</strong> ${bookingData.checkOut}</p>
                    <p><strong>Huéspedes:</strong> ${bookingData.guests}</p>
                    <p><strong>Tipo de habitación:</strong> ${bookingData.roomType}</p>
                    <p><strong>Total:</strong> S/ ${bookingData.totalPrice.toFixed(2)}</p>
                </div>
                <button class="w-full bg-hotel-accent hover:bg-hotel-primary text-white py-3 px-6 rounded-lg transition duration-300">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(confirmationModal);
        
        confirmationModal.querySelector('button').addEventListener('click', () => {
            confirmationModal.remove();
        });
    }

    showBookingError() {
        const errorModal = document.createElement('div');
        errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        errorModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-red-600 mb-4">Error en la Reserva</h3>
                <p class="mb-6">Lo sentimos, hubo un error al procesar su reserva. Por favor, intente nuevamente.</p>
                <button class="w-full bg-hotel-accent hover:bg-hotel-primary text-white py-3 px-6 rounded-lg transition duration-300">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(errorModal);
        
        errorModal.querySelector('button').addEventListener('click', () => {
            errorModal.remove();
        });
    }

    showPaymentError() {
        const errorModal = document.createElement('div');
        errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        errorModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-red-600 mb-4">Error en el Pago</h3>
                <p class="mb-6">Lo sentimos, hubo un error al procesar su pago. Por favor, intente nuevamente o elija otro método de pago.</p>
                <button class="w-full bg-hotel-accent hover:bg-hotel-primary text-white py-3 px-6 rounded-lg transition duration-300">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(errorModal);
        
        errorModal.querySelector('button').addEventListener('click', () => {
            errorModal.remove();
        });
    }
}

// Inicializar el sistema de reservas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
}); 