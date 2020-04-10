/*** 
DATA AND JAVASCRIPT URLS
here we say we have an html page (mime type) pretend this is a url to some server and 
we made a request to that server and whatever follows the comma is what that server returned
content-type header is set to text/html

data:text/html,<h1>hi</h1>
data:text/html, <html contenteditable></html>
so here we can insert scripts

javascript urls let you run javascript in the context
of a particular page

javascript:alert('hi') if this is copy pasted from clipboard browsers like chrome  //not much in use these days
strip out the `javascript` to prevent the user from phishing attacks

// data urls are used to show tiny images inline as blobs in img tags or css

USER INPUT IN FUNCTIONS:
<div onmouseover='handleHover(USER_DATA_HERE)'>
• Escaping ' and " is not enough here!
• Attack input: ); alert(document.cookie
<div onmouseover='handleHover(); alert(document.cookie)'>

ELEMENT IDS AS USER INPUT
<div id='USER_DATA_HERE'>Some text</div>
User input: username
Resulting page:
<div id='username'>Some text</div>
Since HTML Tags with provided IDs become globally accessible DOM Elements also 
the DOM automatically created a variable with that name in javascript which is a global
variable. So by letting users control ids we are letting them create global variables

<div id='username'>Some text</div>
*** the script below is a valid script ***
<script>
 // There's now a `username` variable which
 // references the above <div>
 if (typeof username !== 'undefined') {
 // do something!
 }
</script

SCRIPT ELEMENTS: TRYING TO PUT USER DATA BETWEEN SINGLE OR DOUBLE QUOTES
 Use \' and \" to replace them

 <script>
 let username = 'USER_DATA_HERE'
 alert(`Hi there, ${username}`)
</script>
• User input: Aditi'; alert(document.cookie); //
<script>
 let username = 'Aditi\'; alert(document.cookie); //'
 alert(`Hi there, ${username}`)
</script>

However this could also fail if the user replaces ' with \' -- one solution would be to 
backslash the backslashes
Another approach is to replace ' with &apos; and "  &quot; 
<script>
 let username = 'USER_DATA_HERE'
 alert(`Hi there, ${username}`)
</script>
• User input: Feross'; alert(document.cookie) //
<script>
 let username = 'Feross&apos;; alert(document.cookie) //'
 alert(`Hi there, ${username}`)
</script>

The problems with this is it does not preserve user input 
This is still insecure and not enough as shown below

SCRIPT ELEMENTS::
User input: </script><script>alert(document.cookie)</script><script>
<script>
 let username = '</script><script>alert(document.cookie)</script><script>'
 alert(`Hi there, ${username}`)
</script>

When formatted properly this becomes:
<script>
 let username = '
</script>
<script>
 alert(document.cookie)
</script>
<script>
 '
 alert(`Hi there, ${username}`)
</script>

The first and last script tags error out but the one in the middle executes so escaping 
quotes is not enough

HEXENCODE FIX -- Hex encode user data to produce a string with characters 0-9, A-F.
<script>
 let username = hexDecode('HEX_ENCODED_USER_DATA')
 alert(`Hi there, ${username}`)
</script>
• User input: </script><script>alert(document.cookie)</script><script>
<script>
 let username = hexDecode('3c2f736372697074...')
 alert(`Hi there, ${username}`)
</script>

ANOTHER FIX IS TO USE TEMPLATE TAGS -- INERT TAGS which do not rener until invoked by
javascript
<template id='username'>HTML_ENCODED_USER_DATA</template>
<script>
 let username = document.getElementById('username').textContent
 alert(`Hi there, ${username}`)
</script>
Avoid nesting parsing chains

*****/