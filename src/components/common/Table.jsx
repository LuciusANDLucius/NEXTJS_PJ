export default function Table({ columns, data }) {
return (
<table border="1">
<thead>
<tr>
{columns.map(col => (
<th key={col.key}>{col.label}</th>
))}
</tr>
</thead>
<tbody>
{data.map(row => (
<tr key={row.id}>
{columns.map(col => (
<td key={col.key}>{row[col.key]}</td>
))}
</tr>
))}
</tbody>
</table>
);
}