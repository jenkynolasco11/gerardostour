export const ticketMail = () => {
    return `
    <meta name="viewport" content="width=device-width">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Ticket de abordaje - Gerardo's Transportation</title>

<style>
    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }

    .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
    }
</style>

<div class="invoice-box" style="max-width: 800px; margin: auto; padding: 30px; font-size: 16px; line-height: 24px; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; color: #555;">
    <table cellpadding="0" cellspacing="0" style="width: 100%; line-height: inherit; text-align: left;" width="100%" align="left">
        <tbody>
            <tr class="top">
                <td colspan="2" style="padding: 5px; vertical-align: top;" valign="top">       
                    <table style="width: 100%; line-height: inherit; text-align: left;" width="100%" align="left">
                        <tbody>
                            <tr>
                                <td class="title" style="padding: 5px; vertical-align: top; padding-bottom: 20px; font-size: 45px; line-height: 45px; color: #333;" valign="top">                                
                                    <img src="http://gtxgo.com/gerardostrans/wp-content/uploads/2017/08/logo-transparent.png" style="width:100%; max-width:150px;">                          
                                </td>
                                <td style="padding: 5px; vertical-align: top; text-align: left; padding-bottom: 20px;" valign="top" align="left">
                                    <strong>Ticket #:</strong> ${ ticketNumber }
                                    <br>
                                    <strong>Date:</strong> ${ date }
                                    <br>
                                    <strong>Date:</strong> ${ time }
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr class="information">
                <td colspan="2" style="padding: 5px; vertical-align: top;" valign="top">
                    <table style="width: 100%; line-height: inherit; text-align: left;" width="100%" align="left">
                        <tbody>
                            <tr>
                                <td style="padding: 5px; vertical-align: top; padding-bottom: 40px;" valign="top">
                                    Gerardo's Transportation
                                    <br> 150 W Allegheny Ave
                                    <br> Philadelphia, PA 19133
                                </td>
                                <td style="padding: 5px; vertical-align: top; text-align: right; padding-bottom: 40px;" valign="top" align="right">
                                    ${ firstname } ${ lastname }
                                    <br> 
                                    ${ email }                          
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr class="heading">
                <td style="padding: 5px; vertical-align: top; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;" valign="top">
                    Payment Method                 
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;" valign="top" align="right">
                    Info
                </td>
            </tr>
            <tr class="details">
                ${
                    card 
                    ?
                    `<td style="padding: 5px; vertical-align: top; padding-bottom: 20px;" valign="top">
                        Credit/Debit Card
                    </td>
                    <td style="padding: 5px; vertical-align: top; text-align: right; padding-bottom: 20px;" valign="top" align="right">
                        ${ card }
                    </td>`
                    : ''
                }
            </tr>
            <tr class="heading">
                <td style="padding: 5px; vertical-align: top; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;" valign="top">
                    From
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;" valign="top" align="right">
                    To
                </td>
            </tr>
            <tr class="item">
                <td style="padding: 5px; vertical-align: top; border-bottom: 1px solid #eee;" valign="top">
                    ${ from }
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; border-bottom: 1px solid #eee;" valign="top" align="right">
                    ${ to }
                </td>
            </tr>
            <tr class="item">
                ${
                    pick
                    ?
                    `<td style="padding: 5px; vertical-align: top; border-bottom: 1px solid #eee;" valign="top">
                        ${ pick.street }, ${ pick.city }, ${ pick.state } ${ pick.zip }
                    </td>`
                    : ''
                }
                ${
                    drop
                    ?
                    `<td style="padding: 5px; vertical-align: top; text-align: right; border-bottom: 1px solid #eee;" valign="top" align="right">
                        ${ drop.street }, ${ drop.city }, ${ drop.state } ${ drop.zip }
                    </td>`
                    : ''
                }
            </tr>
            <tr class="heading">
                <td style="padding: 5px; vertical-align: top; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;" valign="top">
                    Item
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;" valign="top" align="right">
                    Price
                </td>
            </tr>
            <tr class="item">
                <td style="padding: 5px; vertical-align: top; border-bottom: 1px solid #eee;" valign="top">
                    ${ ticketQty }
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; border-bottom: 1px solid #eee;" valign="top" align="right">
                    ${ '' }
                </td>
            </tr>
            <tr class="item">
                <td style="padding: 5px; vertical-align: top; border-bottom: 1px solid #eee;" valign="top">
                    ${ luggage }
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; border-bottom: 1px solid #eee;" valign="top" align="right">
                    ${ luggagePrice }
                </td>
            </tr>
            <tr class="item last">
                <td style="padding: 5px; vertical-align: top; border-bottom: none;" valign="top">
                    Extra Routes (Rutas Extras)
                </td>
                <td style="padding: 5px; vertical-align: top; text-align: right; border-bottom: none;" valign="top" align="right">
                    {calc:rutas_price}
                </td>
            </tr>
            <tr class="total">
                <td></td>
                <td style="padding: 5px; vertical-align: top; text-align: right; border-top: 2px solid #eee; font-weight: bold;" valign="top" align="right">
                    ${ totalAmount }
                </td>
            </tr>
        </tbody>
    </table>
</div>
    `
}