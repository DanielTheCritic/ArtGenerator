
function save()
{
    var mimeType = "image/png";

    var canvas = document.getElementById("canvas");
    var image = canvas.toDataURL(mimeType);
    var fileName = "planet";

    canvas.toBlob(function(blob)
    {
        var pom = document.createElement('a');        
        pom.setAttribute('href', window.URL.createObjectURL(blob));
        pom.setAttribute('download', fileName + ".png");
        pom.dataset.downloadurl = [mimeType, pom.download, pom.href].join(':');
        pom.draggable = true;
        pom.classList.add('dragout');
        pom.click();
    });
}