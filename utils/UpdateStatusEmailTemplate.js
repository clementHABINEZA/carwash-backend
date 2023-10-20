const UpdatedStatusEmailTemplate = ({ owner, status }) => {
	return `
    <body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f2f2f2">
        <tr>
            <td align="center" valign="top">
                <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border-radius: 6px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1); margin-top: 25px; margin-bottom: 25px;">
                    <tr>
                        <td valign="top" style="padding: 0 20px;">
                            <h1>Update on Carwash You booked</h1>
                            <p>Dear ${owner}, you car is ${status}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body> 
    `;
};

export { UpdatedStatusEmailTemplate };
