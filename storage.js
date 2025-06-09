//
//ローカルストレージ
//

class LocalStorage {
    constructor(name) {
      this.name = name;
      this.data = {};
    }
    delete() {
      window.localStorage.removeItem(this.name);
    }
    load() {
      let data;
      if(window.localStorage){
        data =  JSON.parse(window.localStorage.getItem(this.name));
      }
      if(data){
        this.data = data;    
        return true;  
      }
      return false;
    }
    save() {
      let data = JSON.stringify(this.data);
      if(window.localStorage){
        window.localStorage.setItem(this.name, data); 
      }
    }
  }
