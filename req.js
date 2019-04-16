let path = require('path')
let fs = require('fs')
function Module(id) {
  this.id = id 
  this.exports = {}
}
/**
 * 根据不同的文件后缀名 进行不同的处理
 */
Module._extensions = {
  '.js'() {},
  '.json'(module) {
    let str = fs.readFileSync(module.id)
    module.exports = JSON.parse(str)
  }
}

function tryMouleLoad(module) {
  let extension = path.extname(module.id)
  Module._extensions[extension](module)
}

function req(modulePath) {
  // 解析绝对路径
  let Pathname = path.join(__dirname, modulePath)
  let module = new Module(Pathname)
  tryMouleLoad(module)
  return module.exports 
}


module.exports = req
