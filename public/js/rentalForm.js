document.addEventListener("DOMContentLoaded", () => {
    const deliveryInput = document.getElementById("deliveryDate");
    const pickupInput = document.getElementById("pickupDate");
    const submitButton = document.getElementById("submitBtn");
    const warning = document.getElementById("schedule-warning");
    const sizeInputs = document.querySelectorAll('input[name="size"]');

    if (!deliveryInput || !pickupInput || !submitButton || !warning || !sizeInputs.length) {
        return;
    }

    const setPickupDate = (dateString) => {
        const delivery = new Date(dateString);
        if (Number.isNaN(delivery.getTime())) {
            return;
        }

        const pickup = new Date(delivery);

        if (delivery.getDay() === 1) {
            pickup.setDate(pickup.getDate() + 3);
        } else if (delivery.getDay() === 4) {
            pickup.setDate(pickup.getDate() + 4);
        }

        pickupInput.value = pickup.toISOString().split("T")[0];
    };

    const setAvailabilityUi = (available) => {
        submitButton.disabled = !available;
        warning.classList.toggle("d-none", available);
    };

    const checkAvailability = async (date, size) => {
        if (!date || !size) {
            return;
        }

        try {
            const response = await fetch(`/availability?date=${date}&size=${size}`);
            const payload = await response.json();
            setAvailabilityUi(!!payload.available);
            setPickupDate(date);
        } catch (error) {
            console.error("Availability check failed:", error);
            setAvailabilityUi(false);
        }
    };

    if (typeof flatpickr === "function") {
        flatpickr(deliveryInput, {
            minDate: new Date().fp_incr(1),
            disable: [
                (date) => {
                    const day = date.getDay();
                    return day !== 1 && day !== 4;
                }
            ],
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "Y-m-d",
            onChange: async (_selectedDates, dateStr) => {
                const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
                await checkAvailability(dateStr, selectedSize);
            }
        });
    }

    sizeInputs.forEach((radio) => {
        radio.addEventListener("change", async () => {
            const date = deliveryInput.value;
            await checkAvailability(date, radio.value);
        });
    });
});
