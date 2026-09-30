// ==========================================
// ข้อมูลร้านส้มตำ
// ==========================================

const shops = [
    {
        name: "ส้มตำแซ่บนัว",
        lat: 13.773332185566147,
        lng: 100.61617590741498,
        rating: 4.7,
        price: "฿฿",
        detail: "ส้มตำรสจัด ไก่ย่าง และอาหารอีสาน"
    },

    {
        name: "ตำปากเปิด",
        lat: 13.72049928134898,
        lng: 100.51454158918988,
        rating: 4.5,
        price: "฿",
        detail: "ส้มตำปลาร้า รสแซ่บ ราคาเป็นกันเอง"
    },

    {
        name: "แซ่บอีหลี",
        lat: 13.726910449573332,
        lng: 100.54605524516782,
        rating: 4.8,
        price: "฿฿",
        detail: "ร้านอาหารอีสาน บรรยากาศสบาย"
    },

    {
        name: "ตำยำแซ่บ",
        lat: 13.678865275142423,
        lng: 100.51237849965338,
        rating: 4.3,
        price: "฿",
        detail: "เมนูส้มตำ ยำ และของทอด"
    }
];


// ==========================================
// สร้างแผนที่
// ==========================================

const defaultLocation = [14.0668, 100.6453];

const map = L.map("map").setView(
    defaultLocation,
    14
);


// แผนที่ OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================================
// ตัวแปรตำแหน่งผู้ใช้
// ==========================================

let userLocation = null;

let userMarker = null;

let userCircle = null;

let shopMarkers = [];


// ==========================================
// คำนวณระยะทาง
// ==========================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// ==========================================
// แสดงร้านบนแผนที่
// ==========================================

function showShops(shopList) {

    // ลบหมุดเก่า
    shopMarkers.forEach(marker => {
        map.removeLayer(marker);
    });

    shopMarkers = [];


    shopList.forEach(shop => {

        let distanceText = "";

        if (userLocation) {

            const distance =
                calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    shop.lat,
                    shop.lng
                );

            distanceText =
                `<br>📍 ห่างจากคุณประมาณ ${distance.toFixed(2)} กม.`;
        }


        const marker =
            L.marker([
                shop.lat,
                shop.lng
            ]).addTo(map);


        marker.bindPopup(`
            <h3>🌶️ ${shop.name}</h3>

            <p>⭐ ${shop.rating}</p>

            <p>💰 ${shop.price}</p>

            <p>${shop.detail}</p>

            ${distanceText}

            <br>

            <a
                href="https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}"
                target="_blank"
            >
                🧭 นำทาง
            </a>
        `);


        shopMarkers.push(marker);
    });
}


// ==========================================
// แสดงรายการร้าน
// ==========================================

function showShopList(shopList) {

    const container =
        document.getElementById("shopContainer");

    container.innerHTML = "";


    shopList.forEach(shop => {

        let distanceText = "";

        if (userLocation) {

            const distance =
                calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    shop.lat,
                    shop.lng
                );

            distanceText =
                `<p>📍 ห่างจากคุณ ${distance.toFixed(2)} กม.</p>`;
        }


        const card =
            document.createElement("div");

        card.className = "shop-card";


        card.innerHTML = `
            <h3>🌶️ ${shop.name}</h3>

            <div class="rating">
                ⭐ ${shop.rating}
            </div>

            <p>💰 ราคา: ${shop.price}</p>

            <p>${shop.detail}</p>

            ${distanceText}

            <a
                class="direction-btn"
                href="https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}"
                target="_blank"
            >
                🧭 นำทาง
            </a>
        `;


        // คลิกการ์ด → ไปยังร้านบนแผนที่
        card.addEventListener(
            "click",
            function(event) {

                // ถ้ากดปุ่มนำทาง ไม่ต้องเปลี่ยนแผนที่
                if (
                    event.target.classList.contains(
                        "direction-btn"
                    )
                ) {
                    return;
                }

                map.setView(
                    [shop.lat, shop.lng],
                    17
                );
            }
        );


        container.appendChild(card);
    });
}


// ==========================================
// แสดงร้านครั้งแรก
// ==========================================

showShops(shops);

showShopList(shops);


// ==========================================
// ค้นหาร้าน
// ==========================================

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener(
    "input",
    function() {

        const keyword =
            this.value.toLowerCase().trim();


        let result =
            shops.filter(shop =>

                shop.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                shop.detail
                    .toLowerCase()
                    .includes(keyword)
            );


        // ถ้ามี GPS ให้เรียงจากใกล้ไปไกล
        if (userLocation) {

            result.sort(
                (a, b) => {

                    const distanceA =
                        calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            a.lat,
                            a.lng
                        );

                    const distanceB =
                        calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            b.lat,
                            b.lng
                        );

                    return distanceA - distanceB;
                }
            );
        }


        showShops(result);

        showShopList(result);
    }
);


// ==========================================
// 📍 ร้านใกล้ฉัน
// ==========================================

function findLocation() {

    if (!navigator.geolocation) {

        alert(
            "อุปกรณ์ของคุณไม่รองรับ GPS"
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            // บันทึกตำแหน่งผู้ใช้
            userLocation = {
                lat: lat,
                lng: lng
            };


            // เลื่อนแผนที่ไปหาผู้ใช้
            map.setView(
                [lat, lng],
                15
            );


            // ลบตำแหน่งเดิม
            if (userMarker) {
                map.removeLayer(userMarker);
            }

            if (userCircle) {
                map.removeLayer(userCircle);
            }


            // สร้างหมุดผู้ใช้
            userMarker =
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(
                        "📍 ตำแหน่งของคุณ"
                    )
                    .openPopup();


            // สร้างวงกลมรัศมี 1 กิโลเมตร
            userCircle =
                L.circle(
                    [lat, lng],
                    {
                        radius: 1000
                    }
                ).addTo(map);


            // คำนวณระยะทางและเรียงร้าน
            const sortedShops =
                [...shops].sort(
                    (a, b) => {

                        const distanceA =
                            calculateDistance(
                                lat,
                                lng,
                                a.lat,
                                a.lng
                            );

                        const distanceB =
                            calculateDistance(
                                lat,
                                lng,
                                b.lat,
                                b.lng
                            );

                        return distanceA - distanceB;
                    }
                );


            // แสดงร้านใหม่
            showShops(sortedShops);

            showShopList(sortedShops);


            alert(
                "📍 พบตำแหน่งของคุณแล้ว!\nร้านถูกเรียงจากใกล้ไปไกล"
            );
        },


        function(error) {

            if (error.code === 1) {

                alert(
                    "❌ คุณไม่อนุญาตให้เว็บไซต์เข้าถึงตำแหน่ง"
                );

            } else {

                alert(
                    "❌ ไม่สามารถระบุตำแหน่งได้ กรุณาลองใหม่"
                );
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}