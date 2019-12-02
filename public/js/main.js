$(document).ready(() => {
    $('.delete-article').on('click', (e) => {
        $target = $(e.target)
        let id = $target.attr('data-id')
        $.ajax({
            method: 'DELETE',
            url: '/article/' + id,
            success: (response) => {
                window.location.href = '/article'
            },
            error: (err) => {
                console.log(err)
            }
        })
    });
});