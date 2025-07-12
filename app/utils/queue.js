class QueuedProcessor {
  constructor(processable, processor){
    this.canProcess = processable;
    this.processCallback = processor;
    this.items = [];
  }
  add(item){
    if(this.canProcess && this.items.length == 0){
      this.processCallback(item);
    }else{
      this.items.push(item)
    }
  }
  allowProcessing(){
    this.canProcess = true
  }
  disallowProcessing(){
    this.canProcess = false 
  }
  async processItems(){
    for(var x = 0; x < this.items.length; x++){
      var item = this.items[x];
      await this.processCallback(item);
      this.items.splice(x,1)
    }
  }
}
export default QueuedProcessor
