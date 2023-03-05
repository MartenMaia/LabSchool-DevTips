// A Classe card serve para a verifiação e salvamento das Dicas no localStorage - Construtor e função salvar()
// Tambem é utilizada para a criação de innerHTML dos card, que são adicionados na listagem <ul> - Função criarCard()
class Card {
    constructor(id,categoria,titulo,skill,descricao,youtube){
        //Aqui são tradas umas exceções do locasStorage caso o mesmo esteja vazio ou com um elemento invalido.
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

    //Aqui é feito o salvamento do card na base de dados
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
        alert('Dica salva com sucesso!')
        return novoCard;
    }

    //Esta função é responavel por forma um card paramerizado em HTML
    //A inserção do elemento no HTML é feito na função "carregarBase" dentro do loop de verificação da base de dados.
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
        <div><span>Skill:</span> &nbsp${this.skill}</div>
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

// A Class Dash é responsavel por carregar e atualizar os dados do dashboard da aplicação, sincronizando após verificação!
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

//Função responsavel por deletar o card selecionado e atualizar a base de dados de acordo.
function Deletar(id){
    let confirmar = confirm("Voce realmente deseja deletar este item?")
    if(!confirmar){
        return false;
    }
    let base = JSON.parse(localStorage.repositorio);
    let nvBase = [];

    //Aqui é criada uma nova lista, e caso o item com id for encontrado, o mesmo não é adicionado à lista
    //Ficando de fora no salvamento no Storage posteriormente
    for (let index = 0; index < base.length; index++) {
        if(base != null && base[index]['id'] == id){
            continue
        }
        nvBase.push(base[index])
    }

    localStorage.repositorio = JSON.stringify(nvBase);
    carregarBase(false)
    alert('Dica deletado com sucesso!')
    new Dash;

    return nvBase;
}

function Submit(form){
    //VALIDAÇÃO DAS ENTRADAS E DA URL DO YOUTUBE
    let validacao = true;

    let titulo = form.titulo.value == "" ? validacao = false : form.titulo.value;
    let skill = form.skill.value == "" ? validacao = false : form.skill.value;
    let categoria = form.categoria.value == "" ? validacao = false : form.categoria.value;
    let descricao = form.descricao.value == "" ? validacao = false : form.descricao.value;

    //Validação da URL do youtube, caso não seja uma URL valida, a entrada será recusada.
    if(form.youtube.value != ""){
        try{
            let validarURL = new URL(form.youtube.value);
        } catch {
            validacao = false
        }
    }
    let youtube = form.youtube.value;

    if(validacao == false) return alert("DADOS INVALIDOS!");

    //CONFIRMAÇÃO DE ENTRADA
    let confirmar = confirm('Deseja confirma o envio desta dica?');
    if(!confirmar){
        return false
    }

    //CRIAÇÃO DO CARD E SALVAMENTO NO LOCALsTORAGE
    let novoCard = new Card(undefined,categoria,titulo, skill, descricao, youtube);
    novoCard.salvar();

    //Atualização do Dash e dos Card
    new Dash;
    carregarBase(false)

    //Limpeza do forms
    return form.reset();
}

//Função responsavel pela edição das descrições das dicas!
function Editar(id){
    //Confirmação de edição
    let confirmar = confirm('Voce confirma que gostaria de editar esta dica?');
    if(!confirmar){
        return false
    }

    let base = JSON.parse(localStorage.repositorio);
    let nvBase = [];

    //Aqui é feita a verificação da base à procura da Dica com ID selecinada
    //Após encontrado, é feita a substituição via Prompt, passando a descrição antiga como referencia.
    for (let index = 0; index < base.length; index++) {
        if(base != null && base[index]['id'] == id){
            let novaDescricao = base[index]
            novaDescricao['descricao'] = prompt('Digite a nova dica:',base[index]['descricao'])
            nvBase.push(novaDescricao)
            continue
        }
        nvBase.push(base[index])
    }

    localStorage.repositorio = JSON.stringify(nvBase);
    carregarBase(false)
    alert('Dica editada com sucesso!')

    return nvBase;
}

//Motor que limpa o imput de busca e recarrega a base de acordo
function limparPesquisa(){
    document.querySelector(".pesquisa input").value = "";
    carregarBase(false);
}

//Função responsavel pelo carregamento dos cards para a visão do usuario
//É passado um parametro bolleano (true ou false)
//Caso true, é porque há um input de busca, e apartir dele é feita uma busca na base para a exibição de acordo
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
    
        //Loop de verificação das keys de acordo com o input enviado
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
                //Responsavel por carregar os card (li) no elemento (ul) da pagina.
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

//Inicialização do sistema
//Para comecar a visuação a WEB, é feito o carregamento do DASH (Class Dash) e o carregamento da base (carregarBase(false) - sem parametro de pesquisa)
//Assim o usuario tem uma visão do dashboard e das dicas cadastradas assim que entrada na pagina!
new Dash;
carregarBase(false);