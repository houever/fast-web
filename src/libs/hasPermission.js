const hasPermission = {
  install (Vue, options) {
    Vue.directive('hasPermission', {
      bind (el, binding, vnode) {
        //let permTypes = vnode.context.$route.meta.permTypes;
        let btns=localStorage.getItem("btns");
        let buttonperms=JSON.parse(btns);
        if(btns==undefined || btns==null){
          el.parentNode.removeChild(el);
        }
        if(!buttonperms.includes(binding.value)){
          el.parentNode.removeChild(el);
        }
      }
    });
  }
};

export default hasPermission;
