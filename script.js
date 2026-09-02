/* =====================================================
   سعّرلي - SCRIPT
===================================================== */

/* =====================================================
   STORAGE
===================================================== */

let products =
  JSON.parse(
    localStorage.getItem("sa3erli_products")
  ) || [];

let orders =
  JSON.parse(
    localStorage.getItem("sa3erli_orders")
  ) || [];

let currentImage = "";


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId, element){

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  const page =
    document.getElementById(pageId);

  if(page){
    page.classList.add("active");
  }

  document
    .querySelectorAll(".nav-item")
    .forEach(item => {
      item.classList.remove("active");
    });

  if(element){
    element.classList.add("active");
  }

  if(pageId === "prices"){
    renderProducts();
  }

  if(pageId === "orders"){
    renderOrders();
  }

  if(pageId === "profits"){
    updateDashboard();
  }
}


/* =====================================================
   PRICING MODAL
===================================================== */

function openPricing(ai=false){

  document
    .getElementById("pricingModal")
    .style.display = "flex";

  if(ai){

    setTimeout(() => {

      alert(
        "📸 اختر صورة المنتج أولاً، ثم اضغط على «تحليل AI تجريبي»."
      );

    },300);

  }
}


function closePricing(){

  document
    .getElementById("pricingModal")
    .style.display = "none";

}


/* =====================================================
   CAMERA
===================================================== */

function openCamera(){

  document
    .getElementById("cameraInput")
    .click();

}


/* =====================================================
   GALLERY
===================================================== */

function openGallery(){

  document
    .getElementById("galleryInput")
    .click();

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function previewImage(input){

  if(
    !input.files ||
    !input.files[0]
  ){
    return;
  }

  const file =
    input.files[0];

  const reader =
    new FileReader();

  reader.onload = function(event){

    currentImage =
      event.target.result;

    const preview =
      document.getElementById(
        "photoPreview"
      );

    preview.src =
      currentImage;

    preview.style.display =
      "block";

  };

  reader.readAsDataURL(file);

}


/* =====================================================
   AI DEMO
===================================================== */

function aiAnalysis(){

  const name =
    document
      .getElementById("productName")
      .value;

  if(!currentImage){

    alert(
      "📸 أضف صورة المنتج أولاً."
    );

    return;
  }

  alert(
    "🤖 جاري تحليل الصورة تجريبيًا..."
  );

  setTimeout(() => {

    if(!name){

      document
        .getElementById("productName")
        .value =
        "منتج مطبوع";

    }

    alert(
      "🤖 التحليل التجريبي:\n\n" +
      "نوع محتمل: منتج للطباعة\n" +
      "يمكنك تعديل المعلومات قبل الحساب."
    );

  },1000);

}


/* =====================================================
   CALCULATE PRICE
===================================================== */

function calculatePrice(){

  const name =
    document
      .getElementById("productName")
      .value
      .trim();

  const material =
    Number(
      document
        .getElementById("materialCost")
        .value
    ) || 0;

  const printing =
    Number(
      document
        .getElementById("printCost")
        .value
    ) || 0;

  const design =
    Number(
      document
        .getElementById("designCost")
        .value
    ) || 0;

  const extra =
    Number(
      document
        .getElementById("extraCost")
        .value
    ) || 0;

  const quantity =
    Number(
      document
        .getElementById("quantity")
        .value
    ) || 1;

  const margin =
    Number(
      document
        .getElementById("margin")
        .value
    ) || 0;


  if(!name){

    alert(
      "أدخل اسم المنتج."
    );

    return;
  }


  const unitCost =
    material +
    printing +
    design +
    extra;


  const sellingPrice =
    unitCost +
    (
      unitCost *
      margin /
      100
    );


  const unitProfit =
    sellingPrice -
    unitCost;


  const total =
    sellingPrice *
    quantity;


  document
    .getElementById("resultCost")
    .textContent =
    Math.round(unitCost) +
    " دج";


  document
    .getElementById("resultPrice")
    .textContent =
    Math.round(sellingPrice) +
    " دج";


  document
    .getElementById("resultProfit")
    .textContent =
    Math.round(unitProfit) +
    " دج";


  document
    .getElementById("resultTotal")
    .textContent =
    Math.round(total) +
    " دج";


  document
    .getElementById("resultCard")
    .style.display =
    "block";


  window.currentCalculation = {

    name:name,

    category:
      document
        .getElementById("productCategory")
        .value,

    cost:unitCost,

    price:sellingPrice,

    profit:unitProfit,

    quantity:quantity,

    total:total,

    margin:margin,

    image:currentImage,

    date:
      new Date()
        .toLocaleDateString("ar-DZ")

  };

}


/* =====================================================
   SAVE PRODUCT
===================================================== */

function saveProduct(){

  if(!window.currentCalculation){

    alert(
      "احسب السعر أولاً."
    );

    return;
  }


  const product = {

    id:Date.now(),

    ...window.currentCalculation

  };


  products.unshift(product);


  localStorage.setItem(
    "sa3erli_products",
    JSON.stringify(products)
  );


  alert(
    "✅ تم حفظ عملية التسعير."
  );


  closePricing();

  resetPricing();

  updateDashboard();

  renderProducts();

}


/* =====================================================
   RESET PRICING
===================================================== */

function resetPricing(){

  document
    .getElementById("productName")
    .value = "";


  document
    .getElementById("materialCost")
    .value = "";


  document
    .getElementById("printCost")
    .value = "";


  document
    .getElementById("designCost")
    .value = "";


  document
    .getElementById("extraCost")
    .value = "";


  document
    .getElementById("quantity")
    .value = "1";


  document
    .getElementById("margin")
    .value = "40";


  document
    .getElementById("photoPreview")
    .style.display =
    "none";


  document
    .getElementById("resultCard")
    .style.display =
    "none";


  currentImage = "";

  window.currentCalculation = null;

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(){

  const container =
    document
      .getElementById("productsList");


  if(!container){
    return;
  }


  const search =
    document
      .getElementById("searchProducts")
      .value
      .toLowerCase();


  const filtered =
    products.filter(product =>

      String(product.name)
        .toLowerCase()
        .includes(search)

    );


  if(filtered.length === 0){

    container.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          💰
        </div>

        <h3>
          لا توجد منتجات
        </h3>

        <p>
          ابدأ بتسعير أول منتج
          وسيظهر هنا.
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML =
    filtered
      .map(product => `

        <div class="product-card">

          <div class="product-top">

            <div class="product-image">

              ${
                product.image

                ?

                `<img
                  src="${product.image}"
                  alt="${escapeHTML(product.name)}"
                >`

                :

                "📦"
              }

            </div>


            <div class="product-info">

              <h3>
                ${escapeHTML(product.name)}
              </h3>

              <p>
                ${escapeHTML(product.category)}
                ·
                ${escapeHTML(product.date)}
              </p>

            </div>


            <div class="product-price">

              ${Math.round(product.price)}
              دج

            </div>

          </div>


          <div class="product-bottom">

            <div class="product-stat">

              التكلفة

              <strong>
                ${Math.round(product.cost)}
                دج
              </strong>

            </div>


            <div class="product-stat">

              الربح

              <strong>
                ${Math.round(product.profit)}
                دج
              </strong>

            </div>


            <div class="product-stat">

              الكمية

              <strong>
                ${product.quantity}
              </strong>

            </div>

          </div>


          <button
            onclick="deleteProduct(${product.id})"
            style="
              border:0;
              background:none;
              color:#e65353;
              font-size:11px;
              margin-top:12px;
              cursor:pointer;
            "
          >

            🗑️ حذف

          </button>

        </div>

      `)
      .join("");

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(id){

  if(
    !confirm(
      "هل تريد حذف هذا المنتج؟"
    )
  ){
    return;
  }


  products =
    products.filter(
      product =>
        product.id !== id
    );


  localStorage.setItem(
    "sa3erli_products",
    JSON.stringify(products)
  );


  renderProducts();

  updateDashboard();

}


/* =====================================================
   ADD ORDER
===================================================== */

function addOrder(){

  if(products.length === 0){

    alert(
      "أضف منتجًا أولاً من صفحة أسعاري."
    );

    return;
  }


  const product =
    products[0];


  const order = {

    id:Date.now(),

    name:product.name,

    quantity:product.quantity,

    total:product.total,

    status:"جديد",

    date:
      new Date()
        .toLocaleDateString("ar-DZ")

  };


  orders.unshift(order);


  localStorage.setItem(
    "sa3erli_orders",
    JSON.stringify(orders)
  );


  renderOrders();

  updateDashboard();


  alert(
    "✅ تمت إضافة الطلبية."
  );

}


/* =====================================================
   RENDER ORDERS
===================================================== */

function renderOrders(){

  const container =
    document
      .getElementById("ordersList");


  if(!container){
    return;
  }


  if(orders.length === 0){

    container.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          📦
        </div>

        <h3>
          لا توجد طلبيات
        </h3>

        <p>
          أضف طلبية لتبدأ في
          متابعة عملياتك.
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML =
    orders
      .map(order => `

        <div class="order-card">

          <div class="order-head">

            <div>

              <strong>
                ${escapeHTML(order.name)}
              </strong>

              <div
                style="
                  color:#999;
                  font-size:10px;
                  margin-top:5px;
                "
              >

                ${escapeHTML(order.date)}

              </div>

            </div>


            <div class="order-status">

              ${escapeHTML(order.status)}

            </div>

          </div>


          <div
            style="
              margin-top:12px;
              font-size:12px;
              color:#777;
            "
          >

            الكمية:
            ${order.quantity}

          </div>


          <div class="order-total">

            ${Math.round(order.total)}
            دج

          </div>

        </div>

      `)
      .join("");

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard(){

  let totalProfit = 0;


  products.forEach(product => {

    totalProfit +=
      Number(product.profit) *
      Number(product.quantity);

  });


  const average =
    products.length
      ?
      totalProfit /
      products.length
      :
      0;


  const homeProfit =
    document.getElementById(
      "homeProfit"
    );

  const homeOrders =
    document.getElementById(
      "homeOrders"
    );

  const homeProducts =
    document.getElementById(
      "homeProducts"
    );

  const homeAverage =
    document.getElementById(
      "homeAverage"
    );

  const totalProfitElement =
    document.getElementById(
      "totalProfit"
    );

  const profitAverage =
    document.getElementById(
      "profitAverage"
    );

  const profitProducts =
    document.getElementById(
      "profitProducts"
    );


  if(homeProfit){
    homeProfit.textContent =
      Math.round(totalProfit) +
      " دج";
  }


  if(homeOrders){
    homeOrders.textContent =
      orders.length;
  }


  if(homeProducts){
    homeProducts.textContent =
      products.length;
  }


  if(homeAverage){
    homeAverage.textContent =
      Math.round(average) +
      " دج";
  }


  if(totalProfitElement){
    totalProfitElement.textContent =
      Math.round(totalProfit) +
      " دج";
  }


  if(profitAverage){
    profitAverage.textContent =
      Math.round(average) +
      " دج";
  }


  if(profitProducts){
    profitProducts.textContent =
      products.length;
  }


  renderRecent();

}


/* =====================================================
   RECENT OPERATIONS
===================================================== */

function renderRecent(){

  const container =
    document
      .getElementById("recentList");


  if(!container){
    return;
  }


  if(products.length === 0){

    container.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          🧮
        </div>

        <h3>
          لا توجد عمليات بعد
        </h3>

        <p>
          ابدأ بتسعير أول منتج.
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML =
    products
      .slice(0,3)
      .map(product => `

        <div class="operation">

          <div class="operation-icon">

            ${
              product.image

              ?

              `<img
                src="${product.image}"
                alt="${escapeHTML(product.name)}"
              >`

              :

              "🧮"
            }

          </div>


          <div class="operation-info">

            <div class="operation-name">

              ${escapeHTML(product.name)}

            </div>


            <div class="operation-date">

              ${escapeHTML(product.date)}

            </div>

          </div>


          <div class="operation-profit">

            +${Math.round(product.profit)}
            دج

          </div>

        </div>

      `)
      .join("");

}


/* =====================================================
   ARTICLES
===================================================== */

function openArticle(type){

  showPage("content");


  let title = "";

  let text = "";


  if(type === "pricing"){

    title =
      "🧮 أساسيات التسعير";

    text =
      "التسعير الصحيح يبدأ من معرفة التكلفة الحقيقية. احسب تكلفة المواد، الطباعة، التصميم، الوقت والمصاريف الإضافية، ثم حدد هامش الربح المناسب.";

  }


  if(type === "printing"){

    title =
      "🖨️ تسعير الطباعة";

    text =
      "في الطباعة لا تحسب الورق فقط. أضف الحبر أو التونر، الكهرباء، القص، التجليد، التغليف ووقت العمل حتى تحصل على تكلفة واقعية.";

  }


  if(type === "digital"){

    title =
      "💻 المنتجات الرقمية";

    text =
      "المنتج الرقمي لا يعني أنه بلا تكلفة. احسب وقت التصميم، الخبرة، الأدوات، التحديثات والقيمة التي يحصل عليها العميل.";

  }


  if(type === "pdf"){

    title =
      "📄 عروض الأسعار";

    text =
      "عرض السعر الجيد يجب أن يكون واضحًا ومرتبًا، ويحتوي على بيانات النشاط والعميل والمنتج والكمية والسعر والإجمالي.";

  }


  const articleContainer =
    document.getElementById(
      "articleContainer"
    );


  if(articleContainer){

    articleContainer.innerHTML = `

      <div class="article">

        <h3>
          ${title}
        </h3>

        <p>
          ${text}
        </p>

      </div>

    `;

  }

}


/* =====================================================
   EXPORT DATA
===================================================== */

function exportData(){

  const data = {

    products:products,

    orders:orders,

    exportedAt:
      new Date().toISOString()

  };


  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:"application/json"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");


  a.href = url;

  a.download =
    "sa3erli-backup.json";


  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);


  URL.revokeObjectURL(url);

}


/* =====================================================
   DELETE ALL DATA
===================================================== */

function deleteAllData(){

  if(
    !confirm(
      "⚠️ هل أنت متأكد من حذف جميع المنتجات والطلبات؟"
    )
  ){
    return;
  }


  products = [];

  orders = [];


  localStorage.removeItem(
    "sa3erli_products"
  );


  localStorage.removeItem(
    "sa3erli_orders"
  );


  renderProducts();

  renderOrders();

  updateDashboard();


  alert(
    "تم حذف جميع البيانات."
  );

}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(text){

  return String(text)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    updateDashboard();

    renderProducts();

    renderOrders();

  }
);              