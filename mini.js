class PlatziReactive {
    /*
      options:
        data() => { ... }
    */
    constructor({ data }) {
        this.origen = data();

        // Destino
        /*
        ES6 pone a nuestra disposición una nueva y poderosa herramienta que permite aprovechar 
        algunos aspectos de la metaprogramación que hasta ahora no estaban disponibles con Javascript: Proxy(). 
        Va a permitirnos interceptar las operaciones con objetos y sus propiedades de tal forma que podemos 
        redefinir el comportamiento para cada una de estas acciones.
        */        
        this.$data = new Proxy(this.origen, {
            get(target, name) {
            if (Reflect.has(target, name)) {
                return Reflect.get(target, name);
                }
                console.warn("La propiedad", name, "no existe");
                return "";
            },
            set(target, name, value) {
                Reflect.set(target, name, value);
            }
        });

        /* trampas  de proxy
            handler.has, captura el operador in.
            handler.get, captura el acceso a las propiedades.
            handler.set, captura la escritura de las propiedades.
        */
    }
  
    mount() {
      document.querySelectorAll("*[p-text]").forEach(el => {
        this.pText(el, this.origen, el.getAttribute("p-text"));
      });

      document.querySelectorAll("*[p-model]").forEach(el => {
        const name = el.getAttribute("p-model");
        this.pModel(el, this.$data, name);
  
        el.addEventListener("input", () => {
          Reflect.set(this.$data, name, el.value);
        });
      });



    }
  
    pText(el, target, name) {
      el.innerText = target[name];
    }
  
    pModel() {}
  }
  
  var Platzi = {
    createApp(options) {
      return new PlatziReactive(options);
    }
  };