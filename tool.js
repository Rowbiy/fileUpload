
$(document).ready(function(){
    $('.cover-btn').on('click', function () {
        $('#file').click();
    })
    $('#file').on('change', function () {
        var file = $(this)[0].files[0];
        upload(file, 0);
    })
})

var upload = function (file, skip) {

    var size = file.size;                               // 文件流总大小
    var nameList = file.name.split(".");                // 获取文件名
    var name = '';
    for (var i = 0; i < nameList.length - 1; i++) {
          name += nameList[i];
    }
    var time;
    if (skip === 0) {
        time = new Date().getTime();
    }
    name += "_" + time;
    var fileName = name + "." + nameList[nameList.length - 1];
    var blockSize = 500 * 1024;                         // 每块的大小
    var blockCount = Math.ceil(size / blockSize);       // 总片数
    //计算每一片的起始与结束位置
    var start = skip * blockSize;
    var end = Math.min(size, start + blockSize);
    var currentFileName = name + "_" + (skip + 1) + "." + nameList[nameList.length - 1];    // 每片文件名
    var fileData = file.slice(start, end);                                                  // 截取 部分文件 块


    // 定义表单结构
    var formData = new FormData();                                      // 初始化一个FormData对象
    formData.append("file", fileData);                                  // 将 部分文件 塞入FormData
    formData.append("fileName", fileName);                              // 保存文件名字
    formData.append("currentFileName", currentFileName);                // 当前分片文件名
    formData.append("blockNumber", skip + 1);                           // 当前片数
    formData.append("blockTotal", blockCount);                          // 总片数


    $.ajax({
      url: "http://localhost:7001/dataplat/file/upload",
      type: "POST",
      data: formData,
      processData: false,           // 告诉jQuery不要去处理发送的数据
      contentType: false,           // 告诉jQuery不要去设置Content-Type请求头
      success: function (responseText) {
        if (file.size <= end) {     // 如果上传完成，则跳出继续上传
          alert("上传完成");
          return;
        }
        upload(file, ++skip);       // 递归调用
      },
      error: function(){
          alert('failed upload..');
      }
    });
};

