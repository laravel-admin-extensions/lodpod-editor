(function(){
    class LodpodEditor {
        constructor(container, options, fields){
            this.editor = container
            this.options = options
            this.fields = fields
            this.background = options.background
            this.width = options.width
            this.height = options.height
            this.data = undefined
            this.elements = []
        }

        render(){
            if(this.options.widthField) this.widthField = this.createHiddenField(this.options.widthField)
            if(this.options.heightField) this.heightField = this.createHiddenField(this.options.heightField)
            this.editor.setAttribute('style', 'width:'+this.width+'px; height: '+this.height+'px;')
            this.editor.setAttribute('class', 'lodpod-editor-container')
            this.setBounds()
            this.createToolbar()
            if(this.data.items){
                for(let i=0; i<this.data.items.length; i++){
                    let el = this.data.items[i]
                    this.addText(el)
                }
            }
            
            this.createFields()
            this.renderBg()
        }

        setBounds(){
            this.boundLeft = this.editor.getBoundingClientRect().left
            this.boundTop = this.editor.getBoundingClientRect().top 
            this.boundRight = this.editor.getBoundingClientRect().right
            this.boundBottom = this.editor.getBoundingClientRect().bottom
        }

        createFields(){
            let self = this
            let fieldsContainer = document.createElement('div')
            fieldsContainer.setAttribute('class', 'col-sm-2 clearfix')

            for(let i=0;i<this.fields.length;i++){
                let field = this.fields[i]
                let fieldBtn = document.createElement('span')
                fieldBtn.setAttribute('class', 'lodpod-field')
                fieldBtn.innerText = field.text
                fieldBtn.onclick=function(){
                    self.addText(field);
                }
                fieldsContainer.appendChild(fieldBtn)
            }

            this.editor.parentNode.before(fieldsContainer)
        }

        addToolbarItem(labeltext){
            let item = document.createElement('div')
            item.setAttribute('class', 'lodpod-editor-toolbar-item')
            let label = document.createElement('label')
            label.innerText = labeltext
            item.appendChild(label)
            return item
        }

        renderBg(){
            let self = this
            if(this.bgimg) this.bgimg.remove()
            let bgcontainer = document.createElement('div')
            this.editor.appendChild(bgcontainer)
            bgcontainer.setAttribute('class', 'lodpod-bg-img')
            
            if(this.background){
                let img = document.createElement('img')
                this.bgimg = bgcontainer
                bgcontainer.appendChild(img)
                img.src = this.background
                img.style.display = 'block'
                this.editor.appendChild(bgcontainer)
                let i = new Image()
                i.src = this.background
                i.onload=function(){
                    let w = i.width, h = i.height
                    self.width = w
                    self.height = h
                    self.widthField.value = w
                    self.heightField.value = h
                    self.editor.style.width = w+'px' 
                    self.editor.style.height = (h+30)+'px'
                    self.setBounds()
                }
            }
        }

        uploadBg(file){
            let self = this
            var formData = new FormData();
            if (file) {
                formData.append("file", file);
                formData.append('_token', document.getElementsByName('_token')[0].value)
            }

            //得到xhr对象
            var xhr = null;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open("post", "/admin/lodpodeditortemplates/upload", true);//设置提交方式，url，异步提交
            xhr.onload = function () {
                var bgUrl = xhr.responseText;    //得到返回值
                self.background = bgUrl
                self.renderBg()
            }
            xhr.send(formData);
        }

        setBgClickHandler(setBgFileInput){
            let f = setBgFileInput.files[0]
            let self = this
            if(f){
                this.uploadBg(f)
            }
        }
        createHiddenField(field){
            let hide = document.createElement('input')
            hide.setAttribute('type','hidden')
            hide.setAttribute('id',field)
            hide.setAttribute('name', field)
            return hide
        }
        createToolbar(){
            let self = this
            let toolbar = document.createElement('div')

            toolbar.setAttribute('class', 'lodpod-editor-toolbar clearfix')
            //设置背景图
            let setBg = document.createElement('div')
            setBg.setAttribute('class', 'lodpod-editor-toolbar-item set-bg')
            let setBgBtn = document.createElement('input')
            setBg.appendChild(setBgBtn)
            setBgBtn.setAttribute('id', this.options.backgroundField)
            setBgBtn.setAttribute('name', this.options.backgroundField)
            setBgBtn.setAttribute('accept', "image/jpg,image/jpeg,image/png,image/PNG")
            setBgBtn.setAttribute('type','file')
            setBgBtn.setAttribute('class','set-bg-btn')
            let setBgText = document.createElement('span')
            setBg.appendChild(setBgText)
            setBgText.innerText = '设置背景图'
            setBgText.setAttribute('class','set-bg-span')
            setBgBtn.onchange = function(e){
                self.setBgClickHandler(this)
            }
            toolbar.appendChild(setBg)
            //字体控制
            let fontSizeControl = this.addToolbarItem('字体')
            //字体减小按钮
            let fontSizeMinBtn = document.createElement('button')
            fontSizeControl.appendChild(fontSizeMinBtn)
            fontSizeMinBtn.setAttribute('class', 'lodpod-font-size-btn')
            fontSizeMinBtn.setAttribute('type', 'button')
            fontSizeMinBtn.innerText = '-'
            //显示字体大小
            let fontSizeInput = document.createElement('input')
            fontSizeControl.appendChild(fontSizeInput)
            
            //字体增大按钮
            let fontSizePlusBtn = document.createElement('button')
            fontSizePlusBtn.setAttribute('class', 'lodpod-font-size-btn')
            fontSizeControl.appendChild(fontSizePlusBtn)
            fontSizePlusBtn.setAttribute('type', 'button')
            fontSizePlusBtn.innerText = '+'

            fontSizeInput.setAttribute('ReadOnly', 'True')
            fontSizeInput.setAttribute('id', 'font-size-control')
            fontSizeInput.setAttribute('type','text')
            fontSizeInput.setAttribute('value', '12')
            fontSizeInput.style.width='2em'

            fontSizeMinBtn.onclick = function(){
                if(fontSizeInput.value>0){
                    fontSizeInput.value--
                    self.currentElement.style.fontSize = fontSizeInput.value+'px'
                }
            }

            fontSizePlusBtn.onclick = function(){
                fontSizeInput.value++
                self.currentElement.style.fontSize = fontSizeInput.value+'px'
            }
            
            toolbar.appendChild(fontSizeControl)
            //颜色选择
            let colorSeletor = this.addToolbarItem('颜色')
            let colorInput = document.createElement('input')
            colorInput.setAttribute('id', 'color-control')
            colorInput.setAttribute('type', 'color')
            colorSeletor.appendChild(colorInput)
            colorInput.onchange = function(e){
                self.currentElement.style.color = this.value
            }
            toolbar.appendChild(colorSeletor)

            this.editor.appendChild(toolbar)
            this.toolbar = toolbar
            this.initToolbar()
            
        }

        set(data){
            this.data = data
            this.background = data.background
        }

        changeToolbar(status){
            let items = this.toolbar.getElementsByTagName('input')
            for(let i=0;i<items.length;i++){
                let itm = items[i]
                if(status==='True'){
                    itm.setAttribute('ReadOnly', status)
                }else{
                    itm.removeAttribute('ReadOnly')
                }
            }
        }
        format(px){
            return parseInt(px.replace('px',''))
        }
        getHexColor(color){ 
            var str = []; 
            var rgb = color.split('('); 
            for(var k = 0; k < 3; k++){ 
                 var s = parseInt(rgb[1].split(',')[k]).toString(16); 
                 if(s.length===1){
                    s = s+'0';
                 }
                 str[k] = s
            } 
            str = '#'+str[0]+str[1]+str[2]; 
            return str
        } 
        initToolbar(){
            if(this.currentElement===undefined || this.currentElement===null){
                this.changeToolbar('True')
            }else{
                this.changeToolbar('False')
                document.getElementById('font-size-control').value = this.format(this.currentElement.style.fontSize)
                if(this.currentElement.style.color){
                    document.getElementById('color-control').value = this.getHexColor(this.currentElement.style.color)
                }
            }
        }

        //API
        addText(options){
            let self = this
            let fontSize=options.fontSize?options.fontSize:12,
            color=options.color?options.color:'rgb(0,0,0)', 
            id=options.id, 
            top=options.top?options.top:50, 
            left=options.left?options.left:50, 
            width=options.width?options.width:'auto', 
            height=options.height?options.height:'auto', 
            text=options.text?options.text:'文本'

            let el = document.createElement('div')
            this.editor.appendChild(el)
            let elContainer = document.createElement('div')
            elContainer.setAttribute('class', 'el-container')
            el.appendChild(elContainer)
            el.setAttribute('id', id)
            el.setAttribute('class', 'lodpod-text')
            el.setAttribute('style', 'color:'+color+';font-size:'
                +fontSize+'px; top:'+(top+30)+'px'+';left'+':'+left+'px; width:'+width+'px; height:'+height+'px;')

            let elText = document.createElement('span')
            elContainer.appendChild(elText)
            this.currentElement = el
            elText.innerText = text

            let close = document.createElement('a')
            elContainer.appendChild(close)
            close.setAttribute('href','javascript:void(0)')
            close.innerText = 'x'
            close.setAttribute('class', 'lodpod-editor-close-a')
            close.onclick=function(){

                self.removeItem(this.parentNode)
            }
            

            el.onclick= function(e){
                e.preventDefault()
                self.currentElement = el
                self.initToolbar()
            }

            el.onmousedown = function(e){
                e.preventDefault()
                this.drag = true
                this.diffx = e.clientX - this.offsetLeft;
                this.diffy = e.clientY - this.offsetTop;
            }

            el.onmousemove = function(e){
                e.preventDefault()
                if(this.drag && self.moveInArea(e.clientX, e.clientY) && self.currentElement==this){
                    self.currentElement.style.left = (e.clientX - this.diffx) + "px";
                    self.currentElement.style.top = (e.clientY - this.diffy) + "px";
                }
            }
            el.onmouseup = function(e){
                e.preventDefault()
                this.drag = false
            }

            this.currentElement = el
            this.elements.push(el)
        }

        removeItem(el){
            el.remove()
            let self = this
            this.elements.forEach(function(v, i){
                if(v.id==el.id){
                    delete self.elements[i]
                }
            })
        }

        moveInArea(x, y){
            return x>this.boundLeft
                && x<this.boundRight
                && y<this.boundBottom
                && y>this.boundTop+30
        }

        get(){
            let data = {background:this.background, width:this.width, height:this.height, items:[]}
            let self = this
            this.elements.forEach(function(el){
                data.items.push({
                    top:self.format(el.style.top)-30, 
                    left:self.format(el.style.left), 
                    width:self.format(el.style.width), 
                    height:self.format(el.style.height),
                    text:el.getElementsByTagName('span')[0].innerText.replace(/\<br\>/g,''), id:el.id,
                    color:self.getHexColor(el.style.color),
                    fontSize:self.format(el.style.fontSize)
                })
            })
            return data
        }
    }

    window.LodpodEditor = LodpodEditor
}());
