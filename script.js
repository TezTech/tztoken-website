var editor = ace.edit("code");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/fi");
editor.session.setOption("useWorker", false);
function tokenTable(d){
		var address = $('#address').val();
		var contract = $('#contract').val();
		d = eztz.utility.mic2arr(d);
		eztz.contract.storage(contract).then(function(dd){
			dd = eztz.utility.mic2arr(dd);
			var dps = dd[1][2];
			var tn = dd[1][1];
			$("#tokenDtails").show();
			$("#tokentable>tbody").empty();
			$("#tokentable tbody").append('<tr><td style="text-align:center;">'+(d/Math.pow(10, dps)).toFixed(dps)+" "+tn+'</td></tr>');
			$('button#observe').attr("disabled", false)
			$('button#observe').html("Check Balance")
		});
}
copyToClipboard = function(text) {
if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return clipboardData.setData("Text", text); 

} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}}
$('document').ready(function(){
    
    $('button#copy').click(function(e){
      e.preventDefault();
      copyToClipboard($('#compiled').html());
      alert("Copied, time to run it!");
    });
    $('button#copytransfer').click(function(e){
      e.preventDefault();
      copyToClipboard($('#compiled3').html());
      alert("Copied, time to run it!");
    });
    $('button#observe').click(function(e){
      e.preventDefault();
      var contract = $('#contract').val();
      var address = $('#address').val();
      $('#trans_contract').val(contract);
      $('#trans_from').val(address);
			$('button#observe').attr("disabled", true)
			$('button#observe').html("Loading...")
			
			tztoken.checkBalance(contract, address).then(tokenTable).catch(function(e){
				alert("There was an error getting your token contract");
				$('button#observe').attr("disabled", false)
				$('button#observe').html("Check Balance")
			});
    });
    $('button#transfer').click(function(e){
      var contract = $('#trans_contract').val(),
      from = $('#trans_from').val(),
      to = $('#trans_to').val(),
      amt = $('#trans_amt').val();
      $('button#transfer').val("Loading...");
      $('button#transfer').attr("disabled", true);
      eztz.contract.storage(contract).then(function(r){
        r = eztz.utility.mic2arr(r);
        var dec = r[3];
        var d = '(Pair "'+to+'" (Pair '+(amt*dec).toFixed(0)+' None))';
        console.log(d);
        var packed = "0x19308cc005" + eztz.tezos.encodeRawBytes(eztz.utility.sexp2mic(d)).toLowerCase()
        console.log(packed);
        //eztz.rpc.packData(d, "(pair address (pair mutez (option bytes)))").then(function(r){
          //var d = "0x"+(r.packed).substr(2);
          $("#compiled3").html(`./tezos-client transfer 0 from `+from+` to `+contract+` --arg '`+packed+`'`);
          $('button#transfer').val("Transfer");
          $('button#transfer').attr("disabled", false);
          alert("Done - now copy the command and run it in your node!");
          $("#copytransfer").show();
        // }).catch(function(e){
          // alert("There was an error, try again later");
          // $('button#transfer').val("Transfer");
          // $('button#transfer').attr("disabled", false);
          // alert("There was an error getting your token contract");
        // });
      }).catch(function(e){
        $('button#transfer').val("Transfer");
        $('button#transfer').attr("disabled", false);
        alert("There was an error getting your token contract");
      });
      
      e.preventDefault();
    });
    $('button#generate').click(function(e){
      e.preventDefault();
      var name = $('#name').val(),
      symbol = $('#symbol').val(),
      decimals = $('#decimals').val(),
      totalsupply = $('#totalsupply').val(),
      tz = $('#tz').val();
      $('#trans_from').val(tz);
      if (!name || !symbol || !decimals || !totalsupply || !tz) return alert("Please check your inputs");
      totalsupply = totalsupply * Math.pow(10, decimals);
      $('#compiled').html(`./tezos-client originate contract MyToken for `+tz
      +` transferring 0 from `+tz
      +` running 'parameter bytes;storage (pair (big_map address mutez) (pair string (pair string nat)));code{DUP;CDR;NIL operation;PAIR;SWAP;CAR;DUP;PUSH nat 4;PUSH nat 0;SLICE;IF_NONE{PUSH nat 100;FAILWITH}{};DUP;PUSH bytes 0x19308cc0;COMPARE;EQ;IF{DROP;DUP;SIZE;PUSH nat 4;SWAP;SUB;DUP;GT;IF{}{PUSH nat 102;FAILWITH};ABS;PUSH nat 4;SLICE;IF_NONE{PUSH nat 101;FAILWITH}{};UNPACK (pair address (pair mutez (option bytes)));IF_NONE{PUSH nat 103;FAILWITH}{};PAIR;NONE mutez;PAIR;SENDER;DIP{DUP;CDDDAR};MEM;DIP{PUSH bool True};COMPARE;EQ;IF{}{PUSH string "Failed assert";FAILWITH};SENDER;DIP{DUP;CDDDAR};GET;IF_NONE{PUSH string "Key not found in map";FAILWITH}{};SWAP;SET_CAR;DUP;CAR;DIP{DUP;CDADAR};COMPARE;GE;IF{}{PUSH string "Failed assert";FAILWITH};SENDER;DIP{DUP;CAR;DIP{DUP;CDADAR};SUB;SOME};DIIP{DUP;CDDDAR};UPDATE;SWAP;SET_CDDDAR;PUSH mutez 0;SWAP;SET_CAR;DUP;CDAAR;DIP{DUP;CDDDAR};MEM;DIP{PUSH bool True};COMPARE;EQ;IF{DUP;CDAAR;DIP{DUP;CDDDAR};GET;IF_NONE{PUSH string "Key not found in map";FAILWITH}{};SWAP;SET_CAR}{};DUP;CDAAR;DIP{DUP;CAR;DIP{DUP;CDADAR};ADD;SOME};DIIP{DUP;CDDDAR};UPDATE;SWAP;SET_CDDDAR;DUP;CDADDR;IF_NONE{PUSH bool False}{DROP;PUSH bool True};DIP{PUSH bool True};COMPARE;EQ;IF{DUP;CDADDR;IF_NONE{PUSH string "Optional value is empty";FAILWITH}{};DIP{DUP;CDADAR};SWAP;PAIR;DIP{SENDER};SWAP;PAIR;DIP{PUSH mutez 0};DIIP{DUP;CDAAR;CONTRACT (pair address (pair mutez bytes));IF_NONE{PUSH string "Invalid contract";FAILWITH}{}};TRANSFER_TOKENS;DIP{DUP;CDDAR};CONS;SWAP;SET_CDDAR}{};CDDR}{DROP;PUSH nat 400;FAILWITH}}' --init '(Pair {Elt "`+tz
      +`" `+ totalsupply.toString()
      +`} (Pair "`+ name
      +`" (Pair "`+ symbol
      +`" `+ Math.pow(10, decimals).toString()
      +`)))'`);
      $("#copy").show();
      alert("Done - now copy the command and run it in your node (NOTE, you will need to manually set and accept the burn fee)!");
    });
});
