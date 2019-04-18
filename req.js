
let path = require('path')
let fs = require('fs')
let vm = require('vm')
function Module(id) {
  this.id = id
  this.exports = {}
}

Module.wrapper = [
  '(function (exports, module, require, __dirname, __filename) {',
  '});'
]

Module._cache = {}

/**
 * 根据不同的文件后缀名 进行不同的处理
 */
Module._extensions = {
  '.js'(module) {
    let content = fs.readFileSync(module.id, 'utf8')
    let fnStr = Module.wrapper[0] + content + Module.wrapper[1]
    let fn = vm.runInThisContext(fnStr)
    console.log(fn.toString());
    
    fn.call(module.exports, module.exports, module, req)
  },
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
  let index = 0
  let extnames = Object.keys(Module._extensions)
  // 处理没加后缀名
  function find(path) {
    try {
      fs.accessSync(path)
      // 拿到最终有效的path
      Pathname = path
    } catch (e) {
      // 没找到
      if (index >= extnames.length) throw new Error('文件找不到')
      let ext = extnames[index++]
      find(path + ext)
    }
  }
  find(Pathname)

  // 查找缓存
  if (Module._cache[Pathname]) {
    return Module._cache[Pathname].exports
  }
  let module = new Module(Pathname)
  tryMouleLoad(module)
  Module._cache[Pathname] = module
  return module.exports
}


let a = req('./a2')



