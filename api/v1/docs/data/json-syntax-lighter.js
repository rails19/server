function lightUpJSON(code){
	var strCount = 0;
	//code = code.replace(/(\".*\")(?!\:)/g, "<string>$1</string>");
	return code
		.replace(/.*\n/g, (match) => {
			return "<line>"+ strCount++ + "</line> " + match;
		})
		.replace(/(:\s)(([\d]+)|null)/g, "$1<const>$2</const>")
		.replace(/(\".*\")(:\s)/g, "<name>$1</name>$2")
		.replace(/(:\s)(\".*\")/g, "$1<string>$2</string>")
		.replace(/{ref#([\w.]+)}/g, "<a href=\"$1\">$&</a>");
}
