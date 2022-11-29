class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined ||  this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id') //null
        
        return parseInt(proximoId) + 1
    }

    gravar(d){
        

        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id )

    }

    pesquisar(despesa){
        
        let despesasFiltradas = []

        despesasFiltradas = this.carregarTodosRegistros()

        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
     

        //mes
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return(despesasFiltradas)
    }
    
    carregarTodosRegistros(){

        //array de despesas
        let despesas = []

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em localstorage
        for(let i = 1; i<=id; i++){
            //recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver indices que foram pulados/removidos
            //nestes casos vamos pular esses indices
            if (despesa === null){
                continue //pulando 
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)



    if(despesa.validarDados()){
        bd.gravar(despesa)
        modalSuccess()
        $('#modalRegistraDespesa').modal('show')
        clearData()

 

    } else{
        modalError()
        $('#modalRegistraDespesa').modal('show')
  
    }
   
}

function modalSuccess(){
    document.getElementById('modalTitle').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('modalMessage').innerHTML = 'Despesa cadastrada com sucesso'
    document.getElementById('modalTitle').className = 'modal-title text-success'
    document.getElementById('modalButton').className = ' btn btn-success'
}

function modalError(){
    document.getElementById('modalTitle').innerHTML = 'Erro no registro'
    document.getElementById('modalMessage').innerHTML = 'Algum campo obrigatorio nao foi preenchido'
    document.getElementById('modalTitle').className = ' modal-title text-danger'
    document.getElementById('modalButton').className = 'btn btn-danger'

}

function clearData(){
    ano.value = ''
    mes.value = ''
    dia.value = ''
    descricao.value = ''
    valor.value = ''
}

function carregarListaDespesas(despesas = [], filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.carregarTodosRegistros()
    }    


    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    /*
              <tr>
                <td>15/03/2004</td>
                <td>Alimentacao</td>
                <td>Compras do mes</td>
                <td>3214</td>
              </tr>        
    */ 

    //percorrer o array despesas
    despesas.forEach(function(d){

        //criando o tr
        let linha = listaDespesas.insertRow() //essa funcao faz parte do elemento tbody

        //inserir valores/ criar colunas (td)

        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}` 

        //ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break  
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break              
        }

        linha.insertCell(1).innerHTML = d.tipo


        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar botao de exclusao
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="bi bi-x-lg"></i>'
        btn.id = d.id
        btn.onclick = function(){
            //remover despesa

            bd.remover(this.id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)

    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    

    let despesas = bd.pesquisar(despesa)

    carregarListaDespesas(despesas, true)


    

    
}


