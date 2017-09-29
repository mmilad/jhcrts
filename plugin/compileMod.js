function compileMod(options) {
    // Configure your plugin with options...
  }
  
  compileMod.prototype.apply = function(compiler) {
    compiler.plugin("compile", function(params) {
      console.log("The compiler is starting to compile...");
    });
  
    compiler.plugin("compilation", function(compilation) {
      console.log("The compiler is starting a new compilation...");
  
      compilation.plugin("optimize", function(e) {
        console.log("The compilation is starting to optimize files...");
        console.log(e)
      });
    });
  
    compiler.plugin("emit", function(compilation, callback) {
      console.log("The compilation is going to emit files...");
      
    console.log(compilation)
      callback();
    });
  };
  
  module.exports = compileMod