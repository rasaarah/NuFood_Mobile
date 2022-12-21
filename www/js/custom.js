var iduser;
var saldo;
var status_pesanan_siang;
var status_pesanan_malam;
var kode_pemesanan;
var token;
//---------------------
var pesanan_utama_siang;
var id_user_utama_siang;
var id_makanan_utama_siang;
var note_utama_siang;
//---------------------
var pesanan_alt1_siang;
var id_user_alt1_siang;
var id_makanan_alt1_siang;
var note_alt1_siang;
//---------------------
var pesanan_alt2_siang;
var id_user_alt2_siang;
var id_makanan_alt2_siang;
var note_alt2_siang;
//---------------------
var pesanan_utama_malam;
var id_user_utama_malam;
var id_makanan_utama_malam;
var note_utama_malam;
//---------------------
var pesanan_alt1_malam;
var id_user_alt1_malam;
var id_makanan_alt1_malam;
var note_alt1_malam;
//---------------------
var pesanan_alt2_malam;
var id_user_alt2_malam;
var id_makanan_alt2_malam;
var note_alt2_malam;
var api_url;
var tdb;
var nama_lengkap;
var status;

function writeFile(filePath, str) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        dir.getFile(filePath, {create:true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.seek(fileWriter.length);
                var blob = new Blob([str], {type:'text/plain'});
                fileWriter.write(blob);
                return true;
            }, function () {
                return false;
            });
        });
    });
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        if (isCordovaApp) {
          api_url = 'http://192.168.43.177/karyawan_mobile/api/index.php';

          window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'config.json', function (fileEntry) {
                 
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                    
                      tdb = TAFFY(this.result);
                        if (tdb().filter({'key':'token'}).first())  {
                            //$('#a').hide();
                            //myApp.closeModal();
                            token = tdb().filter({key:'token'}).first().value;
                            iduser = tdb().filter({key:'id_user'}).first().value;
                            saldo = tdb().filter({key:'saldo'}).first().value;
                            nama_lengkap = tdb().filter({key:'nama_lengkap'}).first().value;
                            status = tdb().filter({key:'status'}).first().value;
                            data = { token: token, id_user: iduser, saldo: saldo, nama_lengkap:nama_lengkap, status: status };
                            myApp.closeModal();
                            html = Template7.compile($('script#panelTemplate').html())(data);//ini nama id template7
                            $('#panel_karyawanTampil').html(html);//ini id yg di dalem datapage

                              var d = new Date();

                              var month = d.getMonth()+1;
                              var day = d.getDate();

                              var output = d.getFullYear() + '/' +
                                  (month<10 ? '0' : '') + month + '/' +
                                  (day<10 ? '0' : '') + day;
                              var x = new Date(output +' 7:00:00').getTime();
                              var y = new Date(output +' 11:30:00').getTime();

                              // time of second timespan
                              var a = new Date(output +' 11:31:00').getTime();
                              var b = new Date(output +' 19:00:00').getTime();

                              var c = new Date().getTime();

                              if (c >= x && c <= y) {
                                  document.getElementById("menu_utama_malamTombol").disabled = true;
                              }
                              else if(c >= a && c <= b)
                              {
                                  document.getElementById("menu_utama_siangTombol").disabled = true;
                                  document.getElementById("menu_utama_malamTombol").disabled = false;
                              }
                              else{
                               document.getElementById("menu_utama_siangTombol").disabled = true;
                                 document.getElementById("menu_utama_malamTombol").disabled = true;   
                              }

                        } else {
                             
                        }


                    };
                    reader.readAsText(file);
                }, function () {
                    myApp.alert('', 'Error read file');
                });
            }, function () {
                tdb = TAFFY();
            });

        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       
    }
};

app.initialize();


$(function() { 


  if (!isCordovaApp) {
    api_url = 'http://localhost/karyawan_mobile/api/index.php';
  }
// -------------------------------------------------function login-------------------------------------
  $(document).on('click', '#login_submit', function(){
        nama=$("#nama").val();
        password=$("#password").val();
        $.ajax({
             
            url : api_url + '/Login/ceklogin',
            type: "POST",
            async:false,
            dataType : 'JSON',
             data    : "nama="+nama+"&password="+password,
            
               
            success: function(data) 
            {
                 if(data.success == true)
                {
                    if(data.status==='karyawan')
                    { 
                        
                      iduser=data.id_user;
                      saldo=data.saldo;
                      token=data.token;
                      console.log(iduser);  
                      $('#a').hide();
                      if (tdb().filter({'key':'id_user'}).first())  {
                          tdb().filter({'key':'id_user'}).remove(true);
                      }
                      tdb.insert({key: 'id_user', value: data.id_user}, false);
                      tdb.insert({key: 'token', value: data.token}, false);
                      tdb.insert({key: 'saldo', value: data.saldo}, false);
                      tdb.insert({key: 'status', value: data.status}, false);
                      tdb.insert({key: 'nama_lengkap', value: data.nama_lengkap}, false);
                      if (isCordovaApp) {
                        
                          writeFile('config.json', tdb().stringify());
                      }
                      myApp.closeModal();

                      html = Template7.compile($('script#panelTemplate').html())(data);//ini nama id template7
                      $('#panel_karyawanTampil').html(html);//ini id yg di dalem datapage
                      
                    } 
                   
                    else if(data.status==='admin'){
                       myApp.alert('Admin Tidak Dapat Login','Login');
                    }
                    else{
                       myApp.alert('Login Gagal','Login');
                    }
                }

            },
            error: function (jqXHR,exception)
            {
                 //ajax_error(jqXHR,exception);
         
                 myApp.alert('Login Gagal','Login');

            }
        });

                // ini untuk disable tombol pesan kalo udah mesen
                $.ajax({
                    
                        url : api_url + '/karyawan/Daftar_pesanan_utama_siang/get_pesanan_utama_siang',
                        type: "POST",
                        dataType : 'JSON',
                        async : false,
                        data : {token:token},
                        success: function(data){
                          console.log(data);  
                          status_pesanan_siang = 2;
                        },
                        error: function (jqXHR,exception){
                          status_pesanan_siang = 0;
                        }
                });//tutup ajax

                 // ini untuk disable tombol pesan kalo udah mesen
                $.ajax({
                        url : api_url+'/karyawan/Daftar_pesanan_utama_malam/get_pesanan_utama_malam',
                        type: "POST",
                        dataType : 'JSON',
                        async : false,
                        data : {token:token},
                        success: function(data){
                          console.log(data);  
                          status_pesanan_malam = 2;
                        },
                        error: function (jqXHR,exception){
                          status_pesanan_malam = 0;
                        }
                });//tutup ajax


                             var d = new Date();

                              var month = d.getMonth()+1;
                              var day = d.getDate();

                              var output = d.getFullYear() + '/' +
                                  (month<10 ? '0' : '') + month + '/' +
                                  (day<10 ? '0' : '') + day;
                              var x = new Date(output +' 7:00:00').getTime();
                              var y = new Date(output +' 11:30:00').getTime();

                              // time of second timespan
                              var a = new Date(output +' 11:31:00').getTime();
                              var b = new Date(output +' 19:00:00').getTime();

                              var c = new Date().getTime();

                              if (c >= x && c <= y) {
                                  document.getElementById("menu_utama_malamTombol").disabled = true;
                              }
                              else if(c >= a && c <= b)
                              {
                                  document.getElementById("menu_utama_siangTombol").disabled = true;
                                  document.getElementById("menu_utama_malamTombol").disabled = false;
                              }
                              else{
                               document.getElementById("menu_utama_siangTombol").disabled = true;
                                 document.getElementById("menu_utama_malamTombol").disabled = true;   
                              }
    });

//---------------------------------------end login----------------------------------------

//-------------------------------------------tampil menu utama--------------------------------
  $('.page-content').on('click', '#menu_utama_siangTombol', function(){
      // ini untuk disable tombol pesan kalo udah mesen
                $.ajax({
                    
                        url : api_url + '/karyawan/Daftar_pesanan_utama_siang/get_pesanan_utama_siang',
                        type: "POST",
                        dataType : 'JSON',
                        async : false,
                        data : {token:token},
                        success: function(data){
                          console.log(data);  
                          status_pesanan_siang = 2;
                        },
                        error: function (jqXHR,exception){
                          status_pesanan_siang = 0;
                        }
                });//tutup ajax
       
        $.ajax({ 
        url : api_url + '/karyawan/Menu_utama_siang/get_menu',
        type: "POST",
        dataType : 'JSON',
        async : false,
        success: function(data){  
             html = Template7.compile($('script#menu_utama_siangTemplate').html())(data);
             $('#menu_siang_tampil').html(html);
            //console.log(data);  
            mainView.router.load({'pageName':'menu_utama_siang'});
              //ini biar alert tetep ada di halaman itu doang
            $('.addPesanan_utama_siang_s').each(function(){
              if(saldo < $(this).attr('data-harga')){
                $(this).prop('href', 'javascript:;');
              }
            });

            if(status_pesanan_siang === 2){
              $('.addPesanan_utama_siang_s').prop('href','javascript:;');
              $('.addPesanan_utama_siang_s').addClass('disabled_siang');
              $('.addPesanan_utama_siang_s').removeClass('addPesanan_utama_siang_s');
            }
        }//tutup success
    });//tutup ajax
});
//untuk kalo udah memesan
$('.page-content').on('click','.disabled_siang',function(e){
     myApp.alert('Anda sudah memesan!');
  })


//-------------------------------------end tampil menu utama -----------------------------------------------------

//-------------------------------------tampil menu alt 1 siang----------------------------------------------------
$('#menu_alternatif_satu_siangTombol').click(function(){

       $.ajax({ 
        url : api_url + '/karyawan/Menu_alt1_siang/get_menu',
        type: "POST",
        dataType : 'JSON',
        async : false,
        success: function(data){  
            console.log(data);
             html = Template7.compile($('script#menu_alt1_siangTemplate').html())(data);//ini nama id template7
             $('#menu_alt1_siang_tampil').html(html);//ini id yg di dalem datapage
            // console.log(menu);  
            mainView.router.load({'pageName':'menu_alternatif_satu_siang'});//ini nama pagenya
                //ini biar alert tetep ada di halaman itu doang
            $('.addPesanan_alternatif_satu_siang_s').each(function(){
              if(saldo < $(this).attr('data-harga')){
                $(this).prop('href', 'javascript:;');
              }
            });
        }//tutup success
    });//tutup ajax
       
});
//-------------------------------end tampil menu alt1 siang--------------------------------------------------------

//-------------------------------------tampil menu alt 1 siang----------------------------------------------------
$('#menu_alternatif_dua_siangTombol').click(function(){
        $.ajax({ 
        url : api_url + '/karyawan/Menu_alt2_siang/get_menu',
        type: "POST",
        dataType : 'JSON',
        async : false,

        success: function(data){  
            console.log(data);
            html = Template7.compile($('script#menu_alt2_siangTemplate').html())(data);//ini nama id template7
            $('#menu_alt2_siang_tampil').html(html);//ini id yg di dalem datapage
            //console.log(data);  
            mainView.router.load({'pageName':'menu_alternatif_dua_siang'});//ini nama pagenya
             $('.addPesanan_alternatif_dua_siang_s').each(function(){
              if(saldo < $(this).attr('data-harga')){
                $(this).prop('href', 'javascript:;');
              }
            });
        }//tutup success
      });//tutup ajax
});
//-------------------------------end tampil menu alt1 siang--------------------------------------------------------

//-------------------------------malem----------------------------------

//-------------------------------------tampil menu utama malam----------------------------------------------------
$('.page-content').on('click', '#menu_utama_malamTombol', function(){
       $.ajax({
                        url : api_url+'/karyawan/Daftar_pesanan_utama_malam/get_pesanan_utama_malam',
                        type: "POST",
                        dataType : 'JSON',
                        async : false,
                        data : {token:token},
                        success: function(data){
                          console.log(data);  
                          status_pesanan_malam = 2;
                        },
                        error: function (jqXHR,exception){
                          status_pesanan_malam = 0;
                        }
                });//tutup ajax

       $.ajax({ 
        url : api_url + '/karyawan/Menu_utama_malam/get_menu',
        type: "POST",
        dataType : 'JSON',
        async : false,

        success: function(data){  
            console.log(data);
             html = Template7.compile($('script#menu_utama_malamTemplate').html())(data);
             $('#menu_utama_malam_tampil').html(html);
            //console.log(data);  
            mainView.router.load({'pageName':'menu_utama_malam'});
            //ini biar alert tetep ada di halaman itu doang
            $('.addPesanan_utama_malam_s').each(function(){
              if(saldo < $(this).attr('data-harga')){
                $(this).prop('href', 'javascript:;');
              }
            });

            if(status_pesanan_malam === 2){
              $('.addPesanan_utama_malam_s').prop('href','javascript:;');
              $('.addPesanan_utama_malam_s').addClass('disabled_malam');
              $('.addPesanan_utama_malam_s').removeClass('addPesanan_utama_malam_s');
            }
        }//tutup success
    });//tutup ajax

});
 //untuk kalo udah memesan
$('.page-content').on('click','.disabled_malam',function(e){
     myApp.alert('Anda sudah memesan!');
  })

//-------------------------------end tampil menu utama malam--------------------------------------------------------

//-------------------------------------tampil menu alt 1 malam----------------------------------------------------
$('#menu_alternatif_satu_malamTombol').click(function(){

       $.ajax({ 
        url : api_url + '/karyawan/Menu_alt1_malam/get_menu',
        type: "POST",
        dataType : 'JSON',
        async : false,

        success: function(data){  
            console.log(data);
             html = Template7.compile($('script#menu_alt1_malamTemplate').html())(data);
             $('#menu_alt1_malam_tampil').html(html);
            //console.log(data);  
            mainView.router.load({'pageName':'menu_alternatif_satu_malam'});
            //ini biar alert tetep ada di halaman itu doang
              $('.addPesanan_alternatif_satu_malem_s').each(function(){
              if(saldo < $(this).attr('data-harga')){
                $(this).prop('href', 'javascript:;');
              }
            });

        }//tutup success
    });//tutup ajax

});
//-------------------------------end tampil menu alt1 malam--------------------------------------------------------

//-------------------------------------tampil menu alt 2 malam----------------------------------------------------
$('#menu_alternatif_dua_malamTombol').click(function(){

       $.ajax({ 
        url : api_url + '/karyawan/Menu_alt2_malam/get_menu',
        type: "POST",
        dataType : 'JSON',
        async : false,

        success: function(data){  
            console.log(data);
             html = Template7.compile($('script#menu_alt2_malamTemplate').html())(data);
             $('#menu_alt2_malam_tampil').html(html);
            //console.log(data);  
            mainView.router.load({'pageName':'menu_alternatif_dua_malam'});
            //ini biar alert tetep ada di halaman itu doang
              $('.addPesanan_alternatif_dua_malam_s').each(function(){
              if(saldo < $(this).attr('data-harga')){
                $(this).prop('href', 'javascript:;');
              }
            });
        }//tutup success
    });//tutup ajax

});
//-------------------------------end tampil menu alt2 malam--------------------------------------------------------



//============================================ END TAMPIL MENU==============================================================


// ========================================== ADD PESANAN ======================================================================

//****************************  ADD PESANAN SIANG *************************
//==============================================================================================================================
//pesanan utama siang
$('.page-content').on('click', '.addPesanan_utama_siang_s', function(){
  pesanan_utama_siang = $(this).closest('.menu_utama_siang'); //parent
  console.log(saldo);
if(saldo > 10000 && pesanan_utama_siang.attr('data-harga') <= saldo){
    id_user_utama_siang = iduser;
    id_makanan_utama_siang=pesanan_utama_siang.attr('data-id');
    note_utama_siang=pesanan_utama_siang.find('.note').val();
    console.log(id_makanan_utama_siang+'aaaa');
  }else{
    myApp.alert("saldo tidak cukup",'saldo');
  }

});

//-----------------------------pesanan utama siang--------------------------------

$('.page-content').on('click', '.yakin_1_siang', function(){
  var pesanan_utama_yakin = pesanan_utama_siang;
  var id_user_utama_yakin= id_user_utama_siang;
  var id_makanan_utama_yakin =id_makanan_utama_siang;
  var note_utama_yakin =note_utama_siang;

    $.ajax({
        url : api_url + '/karyawan/pesanan_utama_siang/pesanan_utama_siang',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_utama_yakin, id_makanan:id_makanan_utama_yakin, note:note_utama_yakin}, 
        async : false,
 
        success: function(data){  
          status_pesanan_siang = 2;
          kode_pemesanan = data.kode_pemesanan; 
        },
        error: function (jqXHR,exception){
          myApp.alert('gagal');
        }
    });//tutup ajax
});
//===========================================================================================================

//===========================================================================================================
//pesanan alt1 siang
$('.page-content').on('click', '.addPesanan_alternatif_satu_siang_s', function(){
    pesanan_alt1_siang = $(this).closest('.menu_alternatif_satu_siang'); //parent
if(saldo > 10000 && pesanan_alt1_siang.attr('data-harga') <= saldo){
    id_user_alt1_siang = iduser;
    id_makanan_alt1_siang=pesanan_alt1_siang.attr('data-id');
    note_alt1_siang=pesanan_alt1_siang.find('.note').val();
    console.log(id_makanan_alt1_siang);
  }else{
      myApp.alert("saldo tidak cukup",'saldo');
  }
});



$('.page-content').on('click', '.yakin_2_siang', function(){
var pesanan_utama_yakin = pesanan_utama_siang;
var id_user_utama_yakin= id_user_utama_siang;
var id_makanan_utama_yakin =id_makanan_utama_siang;
var note_utama_yakin =note_utama_siang;
    $.ajax({
        url : api_url + '/karyawan/pesanan_utama_siang/pesanan_utama_siang',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_utama_yakin, id_makanan:id_makanan_utama_yakin, note:note_utama_yakin}, 
        async : false,
 
        success: function(data){  
            console.log(JSON.stringify(data));
            kode_pemesanan = data.kode_pemesanan;
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax

var pesanan_alt1_siang_yakin = pesanan_alt1_siang;
var id_user_alt1_siang_yakin=id_user_alt1_siang;
var id_makanan_alt1_siang_yakin=id_makanan_alt1_siang;
var note_alt1_siang_yakin=note_alt1_siang;
    $.ajax({
        url : api_url + '/karyawan/pesanan_alternatif_satu_siang/pesanan_alternatif_satu_siang',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_alt1_siang_yakin, id_makanan:id_makanan_alt1_siang_yakin, note:note_alt1_siang_yakin, kode_pemesanan:kode_pemesanan  }, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax
});
//pesanan alt1 siang

//===========================================================================================================
//pesanan alt2 siang
$('.page-content').on('click', '.addPesanan_alternatif_dua_siang_s', function(){
 pesanan_alt2_siang = $(this).closest('.menu_alternatif_dua_siang'); //parent
 if(saldo > 10000 && pesanan_alt2_siang.attr('data-harga') <=saldo){
 id_user_alt2_siang = iduser;
 id_makanan_alt2_siang=pesanan_alt2_siang.attr('data-id');
 note_alt2_siang=pesanan_alt2_siang.find('.note').val();
 console.log(id_makanan_alt2_siang);
} else {
   myApp.alert("saldo tidak cukup",'saldo');
}
});


$('.page-content').on('click', '.yakin_3_siang', function(){
var pesanan_utama_yakin = pesanan_utama_siang;
var id_user_utama_yakin= id_user_utama_siang;
var id_makanan_utama_yakin =id_makanan_utama_siang;
var note_utama_yakin =note_utama_siang;
    $.ajax({
        url : api_url + '/karyawan/pesanan_utama_siang/pesanan_utama_siang',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_utama_yakin, id_makanan:id_makanan_utama_yakin, note:note_utama_yakin}, 
        async : false,
 
        success: function(data){  
            console.log(JSON.stringify(data));
            kode_pemesanan = data.kode_pemesanan;
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax

var pesanan_alt1_siang_yakin = pesanan_alt1_siang;
var id_user_alt1_siang_yakin=id_user_alt1_siang;
var id_makanan_alt1_siang_yakin=id_makanan_alt1_siang;
var note_alt1_siang_yakin=note_alt1_siang;
    $.ajax({
        url : api_url + '/karyawan/pesanan_alternatif_satu_siang/pesanan_alternatif_satu_siang',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_alt1_siang_yakin, id_makanan:id_makanan_alt1_siang_yakin, note:note_alt1_siang_yakin, kode_pemesanan:kode_pemesanan  }, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
            
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax

var pesanan_alt2_siang_yakin = pesanan_alt2_siang;
var id_user_alt2_siang_yakin=id_user_alt2_siang;
var id_makanan_alt2_siang_yakin=id_makanan_alt2_siang;
var note_alt2_siang_yakin=note_alt2_siang;
    $.ajax({
        url : api_url + '/karyawan/pesanan_alternatif_dua_siang/pesanan_alternatif_dua_siang',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_alt2_siang_yakin, id_makanan:id_makanan_alt2_siang_yakin, note:note_alt2_siang_yakin, kode_pemesanan:kode_pemesanan}, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
            
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax
});
//pesanan alt2 siang
//============================================================================================================================

//*******************************  ADD PESANAN MALEM ************************
//==============================================================================================================================
//PESANAN UTAMA MALAM
$('.page-content').on('click', '.addPesanan_utama_malam_s', function(){
  console.log(saldo);
  pesanan_utama_malam = $(this).closest('.menu_utama_malam'); //parent

  //ini untuk kalo saldonya gacukup buat mesen makanan yang mahal
  if(saldo > 10000 && pesanan_utama_malam.attr('data-harga') <= saldo){
    id_user_utama_malam = iduser;
    id_makanan_utama_malam=pesanan_utama_malam.attr('data-id');
    note_utama_malam=pesanan_utama_malam.find('.note').val();
    console.log(id_makanan_utama_malam);
  }else{
    myApp.alert("saldo tidak cukup",'saldo');
  }
});


//END PESANAN UTAMA MALAM

$('.page-content').on('click', '.yakin_1_malam', function(){
  var pesanan_utama_malam_yakin = pesanan_utama_malam;
  var id_user_utama_malam_yakin= id_user_utama_malam;
  var id_makanan_utama_malam_yakin =id_makanan_utama_malam;
  var note_utama_malam_yakin =note_utama_malam;
    $.ajax({
        url : api_url + '/karyawan/pesanan_utama_malam/pesanan_utama_malam',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_utama_malam_yakin, id_makanan:id_makanan_utama_malam_yakin, note:note_utama_malam_yakin}, 
        async : false,
 
        success: function(data){  
            console.log(JSON.stringify(data));
            status_pesanan_malam = 2;
            kode_pemesanan = data.kode_pemesanan;
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax
});
//==========================================================================================================

//===========================================================================================================
//pesanan alt1 malam
$('.page-content').on('click', '.addPesanan_alternatif_satu_malem_s', function(){
pesanan_alt1_malam = $(this).closest('.menu_alt1_malam'); //parent
//ini untuk kalo saldonya gacukup buat mesen makanan yang mahal
if(saldo > 10000 && pesanan_alt1_malam.attr('data-harga') <= saldo){
id_user_alt1_malam = iduser;
id_makanan_alt1_malam=pesanan_alt1_malam.attr('data-id');
note_alt1_malam=pesanan_alt1_malam.find('.note').val();
console.log(id_makanan_alt1_malam);
}
else{
    myApp.alert("saldo tidak cukup",'saldo');
  }
});//tutup pagecontent

$('.page-content').on('click', '.yakin_2_malam', function(){
var pesanan_utama_malam_yakin = pesanan_utama_malam;
var id_user_utama_malam_yakin= id_user_utama_malam;
var id_makanan_utama_malam_yakin =id_makanan_utama_malam;
var note_utama_malam_yakin =note_utama_malam;
    $.ajax({
        url : api_url + '/karyawan/pesanan_utama_malam/pesanan_utama_malam',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_utama_malam_yakin, id_makanan:id_makanan_utama_malam_yakin, note:note_utama_malam_yakin}, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
            kode_pemesanan = data.kode_pemesanan;
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax

var pesanan_alt1_malam_yakin = pesanan_alt1_malam;
var id_user_alt1_malam_yakin=id_user_alt1_malam;
var id_makanan_alt1_malam_yakin=id_makanan_alt1_malam;
var note_alt1_malam_yakin=note_alt1_malam;
    $.ajax({
        url : api_url + '/karyawan/pesanan_alternatif_satu_malam/pesanan_alternatif_satu_malam',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_alt1_malam_yakin, id_makanan:id_makanan_alt1_malam_yakin, note:note_alt1_malam_yakin, kode_pemesanan:kode_pemesanan }, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
            
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax
});
// //pesanan alt1 malam

//===========================================================================================================
//pesanan alt2 malam
$('.page-content').on('click', '.addPesanan_alternatif_dua_malam_s', function(){
 pesanan_alt2_malam = $(this).closest('.menu_alt2_malam'); //parent
 //ini untuk kalo saldonya gacukup buat mesen makanan yang mahal
  if(saldo > 10000 && pesanan_alt2_malam.attr('data-harga') <= saldo){
 id_user_alt2_malam= iduser;
 id_makanan_alt2_malam=pesanan_alt2_malam.attr('data-id');
 note_alt2_malam=pesanan_alt2_malam.find('.note').val();
 console.log(id_makanan_alt2_malam);
  }else{
    myApp.alert("saldo tidak cukup",'saldo');
  }
});

$('.page-content').on('click', '.yakin_3_malam', function(){
var pesanan_utama_malam_yakin = pesanan_utama_malam;
var id_user_utama_malam_yakin= id_user_utama_malam;
var id_makanan_utama_malam_yakin =id_makanan_utama_malam;
var note_utama_malam_yakin =note_utama_malam;
    $.ajax({
        url : api_url + '/karyawan/pesanan_utama_malam/pesanan_utama_malam',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_utama_malam_yakin, id_makanan:id_makanan_utama_malam_yakin, note:note_utama_malam_yakin}, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
            kode_pemesanan = data.kode_pemesanan;
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax

var pesanan_alt1_malam_yakin = pesanan_alt1_malam;
var id_user_alt1_malam_yakin=id_user_alt1_malam;
var id_makanan_alt1_malam_yakin=id_makanan_alt1_malam;
var note_alt1_malam_yakin=note_alt1_malam;
    $.ajax({
        url : api_url + '/karyawan/pesanan_alternatif_satu_malam/pesanan_alternatif_satu_malam',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_alt1_malam_yakin, id_makanan:id_makanan_alt1_malam_yakin, note:note_alt1_malam_yakin, kode_pemesanan:kode_pemesanan }, 
        async : false,
 
        success: function(data){  
             console.log(JSON.stringify(data));
            
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('gagal');
            }
    });//tutup ajax

var pesanan_alt2_malam_yakin = pesanan_alt2_malam;
var id_user_alt2_malam_yakin=id_user_alt2_malam;
var id_makanan_alt2_malam_yakin=id_makanan_alt2_malam;
var note_alt2_malam_yakin=note_alt2_malam;
    $.ajax({
        url : api_url + '/karyawan/pesanan_alternatif_dua_malam/pesanan_alternatif_dua_malam',
        type: "POST",
        dataType : 'JSON',
        data : {id_user:id_user_alt2_malam_yakin, id_makanan:id_makanan_alt2_malam_yakin, note:note_alt2_malam_yakin, kode_pemesanan:kode_pemesanan}, 
        async : false,
 
        success: function(data){  
            console.log(JSON.stringify(data));
            
        },//tutup success
          error: function (jqXHR,exception)
            {
              myApp.alert('gagal');
            }
    });//tutup ajax
});
//pesanan alt2 malam

// ========================================== END ADD PESANAN ===================================================================

// ==================================== TAMPIL PESANAN ===================================================================

//-----------------------tampil pesananan utama siang-----------------------------------------------
$('#pesanan_utama_siangTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_pesanan_utama_siang/get_pesanan_utama_siang',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,
 
        success: function(data){  
                console.log(data);  
              html = Template7.compile($('script#pesanan_utama_siangTemplate').html())(data);
             $('#pesanan_siang_utamaTampil').html(html);
            //console.log(data);  
            mainView.router.load({'pageName':'pesanan_utama_siang'});                
        },//tutup success
          error: function (jqXHR,exception)
            {
                 myApp.alert('tidak ada pesanan','Pesanan');

            }
    });//tutup ajax
});
//-----------------------end tampil pesananan utama siang-----------------------------------------------

//-----------------------tampil pesananan alternatif satu siang-----------------------------------------------
$('#pesanan_alt1_siangTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_pesanan_alt1_siang/get_pesanan_alt1_siang',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,

        success: function(data){
              html = Template7.compile($('script#pesanan_alt1_siangTemplate').html())(data);
             $('#pesanan_siang_alt1Tampil').html(html);
            //console.log(data);  
            mainView.router.load({'pageName':'pesanan_alt1_siang'});                   
        },//tutup success
        error: function (jqXHR,exception)
            {
                 myApp.alert('tidak ada pesanan','Pesanan');

            }
    });//tutup ajax
  });
//-----------------------end tampil pesananan alternatif satu siang-----------------------------------------------

//-----------------------tampil pesananan alternatif dua siang-----------------------------------------------
$('#pesanan_alt2_siangTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_pesanan_alt2_siang/get_pesanan_alt2_siang',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,

        success: function(data){   
                console.log(data);  
                 html = Template7.compile($('script#pesanan_alt2_siangTemplate').html())(data);
             $('#pesanan_siang_alt2Tampil').html(html);
            mainView.router.load({'pageName':'pesanan_alt2_siang'});          
        },//tutup success
        error: function (jqXHR,exception)
            {
                 myApp.alert('tidak ada pesanan','Pesanan');

            }
    });//tutup ajax
  });
//-----------------------end tampil pesananan alternatif dua siang-----------------------------------------------

//-----------------------tampil pesananan utama malam-----------------------------------------------
$('#pesanan_utama_malamTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_pesanan_utama_malam/get_pesanan_utama_malam',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,
        success: function(data){                    
                 console.log(data);  
                 html = Template7.compile($('script#pesanan_utama_malamTemplate').html())(data);
                 $('#pesanan_malam_utamaTampil').html(html);
                mainView.router.load({'pageName':'pesanan_utama_malam'});             
        },//tutup success
        error: function (jqXHR,exception)
            {
                 myApp.alert('tidak ada pesanan','Pesanan');

            }
    });//tutup ajax
  });
//-----------------------end tampil pesananan utama malam--------------------------------------------------------------

//-----------------------tampil pesananan alternatif satu malam-----------------------------------------------
  $('#pesanan_alt1_malamTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_pesanan_alt1_malam/get_pesanan_alt1_malam',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,
        success: function(data){         
                console.log(data);
                  html = Template7.compile($('script#pesanan_alt1_malamTemplate').html())(data);
                 $('#pesanan_malam_alt1Tampil').html(html);
                mainView.router.load({'pageName':'pesanan_alt1_malam'});                       
        },//tutup success
        error: function (jqXHR,exception)
            {
                 myApp.alert('tidak ada pesanan','Pesanan');

            }
    });//tutup ajax
  });
//-----------------------end tampil pesananan alternatif satu malam-------------------------------------------------

//-----------------------tampil pesananan alternatif dua malam-----------------------------------------------
  $('#pesanan_alt2_malamTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_pesanan_alt2_malam/get_pesanan_alt2_malam',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,
        success: function(data){   
                 console.log(data);
                  html = Template7.compile($('script#pesanan_alt2_malamTemplate').html())(data);
                 $('#pesanan_malam_alt2Tampil').html(html);
                mainView.router.load({'pageName':'pesanan_alt2_malam'});           
        },//tutup success
        error: function (jqXHR,exception)
            {
                 myApp.alert('tidak ada pesanan','Pesanan');

            }
    });//tutup ajax
  });
//-----------------------tampil pesananan alternatif dua malam -----------------------------------------------

// ==================================== END TAMPIL PESANAN ===================================================================


//======================================== TAMPIL TRANSAKSI=================================================================
$('#transaksiTombol').click(function(){
    $.ajax({
        url : api_url + '/karyawan/Daftar_transaksi/get_transaksi',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,
        success: function(data){   
               console.log(data);
                  html = Template7.compile($('script#transaksiTemplate').html())(data);
                 $('#transaksiTampil').html(html);
                mainView.router.load({'pageName':'transaksi'});  
                           
        }//tutup success
        
    });//tutup ajax
});
//=========================================== END TAMPIL TRANSAKSI ========================================================


//======================================== TAMPIL SALDO=================================================================
$('#saldoTombol').click(function(){

      $.ajax({
        url : api_url + '/karyawan/saldo/get_saldo',
        type: "POST",
        data: {token: token},
        dataType : 'JSON',
        async : false,
        success: function(data){   
               console.log(data);
                  html = Template7.compile($('script#saldoTemplate').html())(data);
                 $('#saldoTampil').html(html);
                mainView.router.load({'pageName':'saldo'});  
                           
        }//tutup success
        
    });//tutup ajax
});
//=========================================== END TAMPIL SALDO ========================================================

}); //tutup function ready