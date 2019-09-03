function lightUpJSON(code){
	var strCount = 0;
	code = code.replace(/.*\n/g, (match) => {
		return "<line>"+ strCount++ + "</line> " + match;
	});
	//code = code.replace(/(\".*\")(?!\:)/g, "<string>$1</string>");
	code = code.replace(/(:\s)(([\d]+)|null)/g, "$1<const>$2</const>");
	code = code.replace(/(\".*\")(:\s)/g, "<name>$1</name>$2");
	code = code.replace(/(:\s)(\".*\")/g, "$1<string>$2</string>");
	code = code.replace(/{ref#([\w.]+)}/g, "<a href=\"$1\">$&</a>");
	return code;
}
