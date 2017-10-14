
export class MergeDeep {

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    deepMerge(target, sources?) {
        if (!sources.length) return target;
        const source = sources.shift();
      
        if (this.isObject(target) && this.isObject(source)) {
          for (const key in source) {
            if (this.isObject(source[key])) {
              if (!target[key]) target[key] = {};
              this.deepMerge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
        }
      
        return this.deepMerge(target, sources);
    }
    init (o, s) {
      return this.deepMerge(o, s)
    }
}