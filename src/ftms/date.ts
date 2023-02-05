
class DateFormatter {

    private monthNamesShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    private monthNames = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"
    ];

    public pretty(dateStr: string | Date): string {
        const date = new Date(dateStr);
        const d = date.getDate();
        const m = this.monthNamesShort[date.getMonth()];
        const y = date.getFullYear();
        return m+' '+d+', '+y;
    }

    public ymd(dateStr:string | Date): string {
        const date = new Date(dateStr);
        const months = date.getMonth()+1;
        const d = ('0' + date.getDate()).slice(-2);
        const m = ('0' + months).slice(-2);
        const y = date.getFullYear();
        return y+'-'+m+'-'+d;
    }

    public my(dateStr:string | Date, short: boolean = false):string {
        const date = new Date(dateStr);
        let m;
        if(short)
            m = this.monthNamesShort[date.getMonth()];
        else
            m = this.monthNames[date.getMonth()];
        const y = date.getFullYear();
        return `${m}, ${y}`;
    }

    public nextMonth(date: Date): Date {
        let current;

        if (date.getMonth() === 11) {
            current = new Date(date.getFullYear() + 1, 0, date.getDate());
        } else {
            current = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }

        return current;
    }

    public now(): Date {
        return new Date();
    }
}

export const dateFormatter = new DateFormatter();