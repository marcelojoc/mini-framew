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
            if (name in target) {
                return target[name];
            }
            console.warn("La propiedad", name, "no existe");
            return "";
            },
            set() {}
        });
    }
  
    mount() {
      document.querySelectorAll("*[p-text]").forEach(el => {
        this.pText(el, this.origen, el.getAttribute("p-text"));
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