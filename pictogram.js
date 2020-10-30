function ready(qcew) {
  //if (error) throw error;
  const table = d3.select('.table-container').append('table');
  table.append('thead');
  table.append('tbody');
  const columns = [
    {
      head: 'Entidad Federativa',
      cl: 'entidad',
      html(row) {
        const text = `<span class='title'>${row.entidad}</span>`;
        return text;
      },
    },
    {
      head: 'Puntaje Normatividad',
      cl: 'emp',
      html(row) {
        const icon = '<span class="fa fa-male"></span>';
        const value = d3.format(',.1f')(row.emp);
        const nIcons = row.emp;
        const text = `<span class='text'>${value}</span>`;
        console.log(nIcons)
        return text + d3.range(nIcons)
          .map(() => icon).join('');
      },
    },
    {
      head: 'Cambio respecto al trimestre anterior',
      cl: 'emp_pc',
      html(row) {
        const scale = d3.scaleThreshold()
          .domain([0, 5, 10])
          .range(['down', 'right', 'up']);
        const icon = `<span class='fa fa-arrow-${scale(row.emp_pc)}'></span>`;
        const value = `${row.emp_pc}%`
        const text = `<span class='text'>${value}</span>`;
        return text + icon;
      },
    }
  ];

  table.call(renderTable);

  function renderTable(table) {
    const tableUpdate = table.select('thead')
      .selectAll('th')
        .data(columns);

    const tableEnter = tableUpdate
      .enter().append('th')
        .attr('class', d => d.cl)
        .text(d => d.head)
        .on('click', (d) => {
          let ascending;
          if (d.ascending) {
            ascending = false;
          } else {
            ascending = true;
          }
          d.ascending = ascending;
          qcew.sort((a, b) => {
            if (ascending) {
              return d3.ascending(a[d.cl], b[d.cl]);
            }
            return d3.descending(a[d.cl], b[d.cl]);
          });
          table.call(renderTable);
        });

    const trUpdate = table.select('tbody').selectAll('tr')
      .data(qcew);

    const trEnter = trUpdate.enter().append('tr');

    const trMerge = trUpdate.merge(trEnter)
      .on('mouseenter', mouseenter)
      .on('mouseleave', mouseleave);

    const tdUpdate = trMerge.selectAll('td')
      .data((row, i) => columns.map((c) => {
        const cell = {};
        d3.keys(c).forEach((k) => {
          cell[k] = typeof c[k] === 'function' ? c[k](row, i) : c[k];
        });
        return cell;
      }));

    const tdEnter = tdUpdate.enter().append('td');

    tdEnter
      .attr('class', d => d.cl)
      .style('background-color', '#fff')
      .style('border-bottom', '.5px solid white');

    tdEnter.merge(tdUpdate).html(d => d.html);
  }
}

function mouseenter() {
  d3.select(this).selectAll('td')
    .style('background-color', '#f0f0f0')
    .style('border-bottom', '.5px solid slategrey');
}

function mouseleave() {
  d3.select(this).selectAll('td')
    .style('background-color', '#fff')
    .style('border-bottom', '.5px solid white');
}
