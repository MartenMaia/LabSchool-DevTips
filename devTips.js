class Card {
    constructor(id,categoria,titulo,skill,descricao,youtube){
        if((localStorage.repositorio == "" || localStorage.repositorio == undefined) && id == undefined){
            this.id = 1;
        }else{
            if(id == null){
                let base = JSON.parse(localStorage.repositorio);
                this.id = base.length+1;
            } else{
                this.id = id;
            }
        }
        this.categoria = categoria;
        this.titulo = titulo;
        this.skill = skill;
        this.descricao = descricao;
        this.youtube = youtube;
    }

    salvar(){
        let base = this.id == 1 ? [] : JSON.parse(localStorage.repositorio);
        let novoCard = {
            id: this.id,
            categoria: this.categoria,
            titulo: this.titulo.toUpperCase(),
            skill: this.skill,
            descricao: this.descricao,
            youtube: this.youtube,
        }
        base.push(novoCard);
        localStorage.repositorio = JSON.stringify(base);
        return novoCard;
    }

    criarCard(id,categoria,titulo,skill,descricao,youtube){
        if(id != null){
            this.id = id;
            this.categoria = categoria;
            this.titulo = titulo;
            this.skill = skill;
            this.descricao = descricao;
            this.youtube = youtube;
        }

        let cartao = document.createElement('li');
        cartao.classList.add('card');

        let cardCat = document.createElement('div');
        cardCat.classList.add('cardCat');
        cardCat.innerHTML = `<div>${this.categoria}</div>`
        let continuacao = this.youtube ? `<a href="${this.youtube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>` : '';
        
        cardCat.innerHTML += "<div>"+continuacao+`
        <button onclick="Editar(${this.id})"><i class="fa-solid fa-pen"></i></button>
        <button onclick="Deletar(${this.id})"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        `

        let cardTitulo = document.createElement('div');
        cardTitulo.classList.add('cardTitulo');
        cardTitulo.innerHTML = `
        <h2>${this.titulo}</h2>
        <div>${this.skill}</div>
        `

        let cardDesc = document.createElement('div');
        cardDesc.classList.add('cardDesc');
        cardDesc.innerText = this.descricao;

        cartao.appendChild(cardCat);
        cartao.appendChild(cardTitulo);
        cartao.appendChild(cardDesc);
        return cartao;
    }
}

function Deletar(id){
    let base = JSON.parse(localStorage.repositorio);
    let nvBase = [];

    for (let index = 0; index < base.length; index++) {
        if(base != null && base[index]['id'] == id){
            continue
        }
        nvBase.push(base[index])
    }

    localStorage.repositorio = JSON.stringify(nvBase);
    carregarBase(false)
    new Dash;

    return nvBase;
}

function Submit(form){
    let titulo = form.titulo.value;
    let skill = form.skill.value;
    let categoria = form.categoria.value;
    let descricao = form.descricao.value;
    let youtube = form.youtube.value;

    let novoCard = new Card(undefined,categoria,titulo, skill, descricao, youtube);
    novoCard.salvar();
    console.log('Card:',novoCard);
    console.log('localStorage',localStorage.repositorio);

    new Dash;
    carregarBase(false)

    return novoCard;
}

class Dash{
    constructor(){
        this.total();
        this.front();
        this.back();
        this.fullstack();
        this.comportamento();
    }
    async total(){
        let query = document.querySelector(".total .dado")

        try{
            let totalSize = JSON.parse(localStorage.repositorio)
            query.innerText = totalSize.length;
            return await totalSize.length;
        } catch {
            query.innerText = 0
            return null;
        }
        
    }

    async front(){
        let query = document.querySelector(".FrontEnd .dado")
        try{
            let frontSize = localStorage.repositorio;
            frontSize = JSON.parse(frontSize);
            frontSize = frontSize.filter(item => (item).categoria == "Front-End").length;

            query.innerText = frontSize;

            return await frontSize
        } catch {
            query.innerText = 0;
            return 0;
        }
        
    }

    async back(){
        let query = document.querySelector(".backend .dado")
        try{
            let backSize = localStorage.repositorio;
            backSize = JSON.parse(backSize);
            backSize = backSize.filter(item => (item).categoria == "Back-End").length;

            query.innerText = backSize;

            return await backSize
        } catch {
            query.innerText = 0;
            return 0;
        }
    }

    async fullstack(){
        let query = document.querySelector(".fullstack .dado")
        try{
            let fullstackSize = localStorage.repositorio;
            fullstackSize = JSON.parse(fullstackSize);
            fullstackSize = fullstackSize.filter(item => (item).categoria == "FullStack").length;
    
            query.innerText = fullstackSize;
    
            return await fullstackSize
        } catch {
            query.innerText = 0;
            return 0;
        }
    }

    async comportamento(){
        let query = document.querySelector(".comportamental .dado")
        try{
            let comportamentoSize = localStorage.repositorio;
            comportamentoSize = JSON.parse(comportamentoSize);
            comportamentoSize = comportamentoSize.filter(item => (item).categoria == "Life-Style").length;
    
            query.innerText = comportamentoSize;
    
            return await comportamentoSize
        } catch {
            query.innerText = 0;
            return 0;
        }
    }
}

async function carregarBase(boollean){


    try{
        let busca = boollean ? document.querySelector(".pesquisa input").value : "";
        let query = document.querySelector(".caixa ul");
        query.innerHTML = "" ;


        let base = localStorage.repositorio;
        if(base.length != 1){
            base = JSON.parse(base);
        }       

        let verificador;
    
        for (let index = 0; index < base.length; index++) {
            const card = base[index];
            if(card != null){
                if(busca != ""){
                    for (const key in card) {
                        if(card[key].toString().toUpperCase().includes(busca.toUpperCase())){
                            verificador = true;
                            break
                        }else{
                            verificador = false;
                        }
                    }
                }
                if(verificador == undefined || verificador == true){
                    let entrada = new Card(card.id,card.categoria,card.titulo,card.skill,card.descricao,card.youtube);
                    query.appendChild(entrada.criarCard())
                    verificador = undefined;
                }            
            }        
        }
        return await true;
    } catch {
        return null;
    }


}

new Dash;

carregarBase(false);