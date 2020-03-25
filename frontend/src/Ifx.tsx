import React from 'react';
function Ifx(props: any) {
	if(props.condition) {
		return (props.children)
	} else {
		return (<div/>)
	}
}

export default Ifx;
