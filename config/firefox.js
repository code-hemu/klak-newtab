export default {
    js: {
        entry:{
            '/': ['src/js/service.js'],
            'data/theme': ['src/js/theme.js']
        },
        
        filename: '[name]',
        target: 'es2020',
        minify: true,
        sourcemap: false
    },					
    scss: {
        entry:{ 
            'data/theme': [
                'src/scss/settings.scss',
                'src/scss/default.scss',
                'src/scss/normal.scss',
                'src/scss/tea.scss',
                'src/scss/orange.scss',
                'src/scss/galaxy.scss',
                'src/scss/neo.scss',
                'src/scss/boss.scss',
                'src/scss/pop.scss',
                'src/scss/retro.scss',
                'src/scss/glow.scss',
                'src/scss/begging.scss',
                'src/scss/gravity.scss',
                'src/scss/scenery.scss',
                'src/scss/firefly.scss',
                'src/scss/space/stars-1x.scss',
                'src/scss/space/stars-2x.scss',
                'src/scss/space/stars-3x.scss',
                'src/scss/space/shooting.scss',
            ]
        },
        filename: '[name]',
        minify: false,
        sourcemap: false
    },
    html: {
        entry:{
            'data/theme': ['src/html/theme.html'],
            '/': ['src/html/service.html']
        },
        filename: '[name]'
    },
    assets:{
        entry:{
           'data/icons': [
                'src/assets/icon',
                'src/assets/svg'
            ],
            'data/fonts': [
                'src/assets/fonts'
            ]
        }
    }
};


