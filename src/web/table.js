class Table {
    constructor(attrs) {
        this.attrs = attrs;
        this.headers = null;
        this.rows = [];
        this.footers = null;
    }

    setHeaders(headers) {
        this.headers = headers;
        return this;
    }

    addRow(row) {
        this.rows.push(row);
        return this;
    }

    addFooterRow(footers) {
        this.footers = footers;
        return this;
    }

    render() {
        return "TODO";
    }
}