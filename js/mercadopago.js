// Integración con Mercado Pago
class MercadoPagoIntegration {
    constructor() {
        this.initializeMercadoPago();
    }

    initializeMercadoPago() {
        // Cargar el script de Mercado Pago
        const script = document.createElement('script');
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.onload = () => {
            // Inicializar Mercado Pago con la clave pública
            // Nota: Reemplazar 'YOUR_PUBLIC_KEY' con tu clave pública real de Mercado Pago
            window.mp = new MercadoPago('YOUR_PUBLIC_KEY', {
                locale: 'es-PE'
            });
        };
        document.body.appendChild(script);
    }

    async createPayment(bookingData) {
        try {
            // Crear el objeto de preferencia para el pago
            const preference = {
                items: [
                    {
                        title: `Reserva - ${bookingData.roomType}`,
                        unit_price: bookingData.pricePerNight,
                        quantity: bookingData.nights,
                        currency_id: 'PEN', // Moneda peruana (Soles)
                        description: `Estancia de ${bookingData.nights} noches en ${bookingData.roomType}`
                    }
                ],
                back_urls: {
                    success: window.location.origin + '/success.html',
                    failure: window.location.origin + '/failure.html',
                    pending: window.location.origin + '/pending.html'
                },
                auto_return: 'approved',
                external_reference: `booking-${Date.now()}`,
                notification_url: window.location.origin + '/webhook',
                statement_descriptor: 'OCEAN VIEW HOTEL',
                expires: true,
                expiration_date_from: new Date().toISOString(),
                expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
            };

            // Enviar la preferencia al servidor para crear el pago
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preference)
            });

            if (!response.ok) {
                throw new Error('Error al crear la preferencia de pago');
            }

            const data = await response.json();
            return data.id; // ID de la preferencia
        } catch (error) {
            console.error('Error al crear el pago:', error);
            throw error;
        }
    }

    async openCheckout(preferenceId) {
        try {
            // Abrir el checkout de Mercado Pago
            const bricksBuilder = window.mp.bricks();
            const renderComponent = async () => {
                await bricksBuilder.create('wallet', 'wallet_container', {
                    initialization: {
                        preferenceId: preferenceId
                    },
                    callbacks: {
                        onError: (error) => console.error('Error en el checkout:', error),
                        onReady: () => console.log('Checkout listo')
                    }
                });
            };
            renderComponent();
        } catch (error) {
            console.error('Error al abrir el checkout:', error);
            throw error;
        }
    }
}

// Exportar la clase para su uso en otros archivos
window.MercadoPagoIntegration = MercadoPagoIntegration; 