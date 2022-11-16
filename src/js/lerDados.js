const httpRequest = new XMLHttpRequest();
let arquivoCsv;
httpRequest.open("GET", "http://localhost:8080/assets/Sao_paulo.csv");
httpRequest.setRequestHeader('Content-type', 'application/csv; charset=UTF-8')
httpRequest.onreadystatechange = function()
{
    if(httpRequest.readyState == 4 && httpRequest.status == 200){
        
        arquivoCsv = httpRequest.responseText
        arquivoCsv = arquivoCsv.replace(/;/g,'|')
        arquivoCsv = arquivoCsv.replace(/,/g,'_')
        arquivoCsv = arquivoCsv.replace(/\|/g,',')
    
        arquivoCsv = arquivoCsv.replace('Street', 'Logradouro')
        arquivoCsv = arquivoCsv.replace('City', 'Bairro')
        arquivoCsv = arquivoCsv.replace('propertycard__detailvalue', 'Área (m²)')
        arquivoCsv = arquivoCsv.replace('quartos', 'Quartos')
        arquivoCsv = arquivoCsv.replace('banheiros', 'Banheiros')
        arquivoCsv = arquivoCsv.replace('vagas', 'Vagas')
        arquivoCsv = arquivoCsv.replace('price', 'Preço (R$)')
    
        let dados = d3.csvParse(arquivoCsv)

        // Remove espaços em branco no início e final dos valores
        dados.forEach(venda => {
            Object.keys(venda).forEach(nomeColuna => {
                if (nomeColuna != "columns"){
                    venda[nomeColuna] = venda[nomeColuna].trim()
                }
            })
        })

        // Adiciona colunas que faltam
        dados.columns.push('Número')
        dados.columns.push('Mínimo Área (m²)')
        dados.columns.push('Máximo Área (m²)')
        dados.columns.push('Mínimo Quartos')
        dados.columns.push('Máximo Quartos')
        dados.columns.push('Mínimo Banheiros')
        dados.columns.push('Máximo Banheiros')
        dados.columns.push('Mínimo Vagas')
        dados.columns.push('Máximo Vagas')

        // Filtra dados ruins
        let dadosFiltrados = dados.filter((venda, index) => {
            if(
                // Remove preços por período
                !venda['Preço (R$)'].match(/\/Mês|\/Dia|\/Ano/g) &&

                // Remove endereços incompletos
                venda.Logradouro.match(/_/g) &&
                venda.Bairro.match(/_\sSão\sPaulo/g)
            ){
                return venda
            }
        })

        dadosFiltrados.forEach(venda => {
            Object.keys(venda).forEach(nomeColuna => {
                switch(nomeColuna){

                    // Quebra endereço em logradouro e número
                    case 'Logradouro':

                        let enderecoQuebrado = venda[nomeColuna].split('_ ') 
                        venda[nomeColuna] = enderecoQuebrado[0]
                        venda['Número'] = enderecoQuebrado[1]
                        break

                    // Recebe apenas o nome do bairro
                    case 'Bairro':

                        venda[nomeColuna] = venda[nomeColuna].split('_')[0]
                        break

                    case 'Preço (R$)':

                        venda[nomeColuna] = venda[nomeColuna].split('R$ ')[1].replace(',', '.')
                        break

                    // Separa em mín e máx
                    case 'Área (m²)':
                    case 'Quartos':
                    case 'Banheiros':
                    case 'Vagas':
                        
                        if(venda[nomeColuna].match(/-/g)){
                            let minMaxQuebrado = venda[nomeColuna].split('-')
                            venda['Mínimo ' + nomeColuna] = minMaxQuebrado[0]
                            venda['Máximo ' + nomeColuna] = minMaxQuebrado[1]
                        }
                        else{
                            venda['Mínimo ' + nomeColuna] = venda[nomeColuna]
                            venda['Máximo ' + nomeColuna] = venda[nomeColuna]
                        }

                        delete venda[nomeColuna]
                }
            })
        })

        dadosFiltrados = dadosFiltrados.filter(venda => {
            if(
                // Filtra coluna de números
                venda.Número != '' &&
                !isNaN(venda.Número) && 
                venda.Número < 99999
            ){
                return venda
            }
        })

        dados.columns.splice(dados.columns.indexOf('Área (m²)'), 1)
        dados.columns.splice(dados.columns.indexOf('Quartos'), 1)
        dados.columns.splice(dados.columns.indexOf('Banheiros'), 1)
        dados.columns.splice(dados.columns.indexOf('Vagas'), 1)

        dadosFiltrados.unshift(dados.columns)
        
        let csvContent = "data:text/csv;charset=UTF-8,%EF%BB%BF" + encodeURIComponent(dadosFiltrados.map(e => Object.values(e).join(";")).join("\n"));
        var aLink = document.createElement('a');
        aLink.href = csvContent;
        aLink.click();

        const dadosParaTabela = dadosFiltrados.map(element => {
            return Object.values(element)
        });
    
        const table = d3.select('body')
        .append('table')
        
        table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(dados.columns)
        .enter().append("th")
        .text(function(d) { return d; })
    
        // data
        table.append("tbody")
        .selectAll("tr").data(dadosParaTabela)
        .enter().append("tr")
        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .text(function(d){return d;})

    }
};
httpRequest.send(null)