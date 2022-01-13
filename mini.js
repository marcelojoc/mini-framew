class PlatziReactive {
  // Dependencias
  deps = new Map();

  /*
    options:
      data() => { ... }
  */
  constructor({ data }) {
    this.origen = data();

    const self = this;

    // Destino
    this.$data = new Proxy(this.origen, {
      get(target, name) {
        /* if (name in target) {
          return target[name];
        } */
        if (Reflect.has(target, name)) {
          self.track(target, name);
          return Reflect.get(target, name);
        }
        console.warn("La propiedad", name, "no existe");
        return "";
      },
      set(target, name, value) {
        Reflect.set(target, name, value);
        self.trigger(name);
      }
    });
  }
    
    /*
        ES6 pone a nuestra disposición una nueva y poderosa herramienta que permite aprovechar 
        algunos aspectos de la metaprogramación que hasta ahora no estaban disponibles con Javascript: Proxy(). 
        Va a permitirnos interceptar las operaciones con objetos y sus propiedades de tal forma que podemos 
        redefinir el comportamiento para cada una de estas acciones.
        */
    /* trampas  de proxy
            handler.has, captura el operador in.
            handler.get, captura el acceso a las propiedades.
            handler.set, captura la escritura de las propiedades.
        */


  track(target, name) {
    if (!this.deps.has(name)) {
      const effect = () => {
        document.querySelectorAll(`*[p-text=${name}]`).forEach(el => {
          this.pText(el, target, name);
        });
      };
      this.deps.set(name, effect);
    }
  }
  trigger(name) {
    const effect = this.deps.get(name);
    effect();
  }

  mount() {
    document.querySelectorAll("*[p-text]").forEach(el => {
      this.pText(el, this.$data, el.getAttribute("p-text"));
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
    el.innerText = Reflect.get(target, name);
  }

  pModel(el, target, name) {
    el.value = Reflect.get(target, name);
  }
}

var Platzi = {
  createApp(options) {
    return new PlatziReactive(options);
  },
};

/**
   * 
        * Effect: Es todo aquello que efectúa un cambio en la aplicación.
        2.Track: Siguen las dependencias dinámicas y sus efectos. 
        Es decir, se mantiene es el acto de dar seguimiento a aquellas variables que producen el efecto, 
        para que si una cambia, el efecto se vuelva a calcular.
        Trigger:: Son los disparadores de los efectos de las dependencias. 
        Es esa acción que se ejecuta después de que el track detectó un cambio para poder actualizar el effect.
   */
