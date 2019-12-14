module.exports = {
    plugins: [
        require('autoprefixer'), // добавляет стили под каждый браузер нужный (webkit)
        require('css-mqpacker'), // меди запросы будет сжимать
        require('cssnano')({  // сжимает css
            preset: [
                'default',{
                    discardComments:{
                        removeAll: true // удаляют комментарии
                    }
                }
            ]
        })
        
    ]
}