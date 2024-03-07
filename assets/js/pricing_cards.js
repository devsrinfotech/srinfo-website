const CRMpricing = document
    .getElementById("headingOne")
    .addEventListener("click", function () { 

        const monthlyPricing = document.getElementById("monthly_pricing");

        const yearlyPricing = document.getElementById("yearly_pricing");

        monthlyPricing.textContent = "₹1000/ Per  User Per Month";

        yearlyPricing.textContent = "₹5000/ Per  User Per Year"

    });

const PMSpricing = document
    .getElementById("headingTwo")
    .addEventListener("click", function () { 

        const monthlyPricing = document.getElementById("monthly_pricing");

        const yearlyPricing = document.getElementById("yearly_pricing");

        monthlyPricing.textContent = "₹2000/ Per  User Per Month";

        yearlyPricing.textContent = "₹6000/ Per  User Per Year"

    });


    const HRMpricing = document
    .getElementById("headingThree")
    .addEventListener("click", function () { 

        const monthlyPricing = document.getElementById("monthly_pricing");

        const yearlyPricing = document.getElementById("yearly_pricing");

        monthlyPricing.textContent = "₹3000/ Per  User Per Month";

        yearlyPricing.textContent = "₹7000/ Per  User Per Year"

    });