$(document).ready(function () {
    
    // Search Button To Search Car Using Registration No
    $('.btn-vehicle-search').click(function () {
        let VRN = $("#VRN").val();
        apiResponse(VRN);
    })
    
    // Getting Vehicle Data
    const apiResponse = (vehicle_number) => {
        
        fetch(
                `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=00a64f32-ef4f-4da9-aa2a-1caecb0099eb&key_VRM=${vehicle_number}`
            )
            .then((response) => response.json())
            .then((data) => {
                const {
                    DateFirstRegistered,
                    Vrm,
                    Model,
                    TransmissionType,
                    FuelType,
                    Make,
                } = data.Response.DataItems.VehicleRegistration;

                const {
                    NextMotDueDate
                } = data.Response.DataItems.VehicleStatus;

                const dateParts = DateFirstRegistered.split('T');
                const year = dateParts[0].split('-')[0];
                const extractedData = {
                    DateFirstRegistered: year,
                    Vrm,
                    Model,
                    TransmissionType,
                    FuelType,
                    Make,
                    NextMotDueDate,
                };


                sessionStorage.setItem("vehicleDetails", JSON.stringify(extractedData));
                window.location.href = 'mot-book-select.html'
                
            })
            .catch((error) => console.error("Error:", error));
    };

});