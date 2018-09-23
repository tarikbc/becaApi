const baseApi = "https://beca.ml/api"
function enviar(product, price){

    var buyer = document.getElementById('buyer-input').value

    if(buyer === ''){
        swal(
            'Ops!',
            'Preencha o seu nome',
            'error'
        )
        return
    }

    var data = {
        buyer: buyer,
        product: product,
        value: price
    }

    $.post(baseApi + "/buy", data)

    swal(
        'Compra efetuada com sucesso!',
        'Obrigado por contribuir com nossa formatura.',
        'success'
    )
}
