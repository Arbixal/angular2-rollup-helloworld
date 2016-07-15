import nodeResolve from 'rollup-plugin-node-resolve';

class RollupNG2 {
    constructor(options){
        this.options = options;
    }
    resolveId(id, from){
        if (id.startsWith('rxjs/')){
            return `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
        }
        // Referenced by RxJs
        if(id.startsWith('symbol-observable'))
        {
            if(id === 'symbol-observable')
            {
                return `${__dirname}/node_modules/symbol-observable/es/index.js`;
            }
            return `${__dirname}/node_modules/symbol-observable/es/${id.split('symbol-observable').pop()}.js`;
        }

        // Angular References
        if(id.startsWith('@angular/common'))
        {
            if(id === '@angular/common')
            {
                return `${__dirname}/node_modules/@angular/common/esm/index.js`;
            }
            return `${__dirname}/node_modules/@angular/common/esm/${id.split('@angular/common').pop()}.js`;
        }
        if(id.startsWith('@angular/compiler'))
        {
            if(id === '@angular/compiler')
            {
                return `${__dirname}/node_modules/@angular/compiler/esm/index.js`;
            }
            return `${__dirname}/node_modules/@angular/compiler/esm/${id.split('@angular/compiler').pop()}.js`;
        }
        if(id.startsWith('@angular/core'))
        {
            if(id === '@angular/core')
            {
                return `${__dirname}/node_modules/@angular/core/esm/index.js`;
            }
            return `${__dirname}/node_modules/@angular/core/esm/${id.split('@angular/core').pop()}.js`;
        }
        if(id.startsWith('@angular/platform-browser-dynamic'))
        {
            if(id === '@angular/platform-browser-dynamic')
            {
                return `${__dirname}/node_modules/@angular/platform-browser-dynamic/esm/index.js`;
            }
            return `${__dirname}/node_modules/@angular/platform-browser-dynamic/esm/${id.split('@angular/platform-browser-dynamic').pop()}.js`;
        }
        // More specific case first to prevent looking under '@angular/platform-browser' for '-dynamic'
        if(id.startsWith('@angular/platform-browser'))
        {
            if(id === '@angular/platform-browser')
            {
                return `${__dirname}/node_modules/@angular/platform-browser/esm/index.js`;
            }
            return `${__dirname}/node_modules/@angular/platform-browser/esm/${id.split('@angular/platform-browser').pop()}.js`;
        }
    }
}

const rollupNG2 = (config) => new RollupNG2(config);

export default {
    entry: 'dist/.rollup/main.js',
    sourceMap: true,
    moduleName: 'main',
    format: 'iife',
    plugins: [
        rollupNG2(),
        nodeResolve({
            jsnext: true, main: true
        })
    ]
}