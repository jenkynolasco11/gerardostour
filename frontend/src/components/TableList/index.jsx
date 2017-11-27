import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'

const extraspace = [
  'last time modified',
  'last session'
]

class TableList extends Component{
  constructor(props) {
    super(props)

    this.state = { 
      overlayHeight : 0,
      canNext : false,
      canPrev : false,
      skip : 0,
    }

    this.renderData = this.renderData.bind(this)
    this.renderDataCell = this.renderDataCell.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.requestUpdateList = this.requestUpdateList.bind(this)
    this._onClickPagination = this._onClickPagination.bind(this)
    this._onClickNav = this._onClickNav.bind(this)
  }

  renderHeader() {
    const { thead } = this.props
    return (
      <div className="view-table__head">
        <div className="view-table__row">
        {
          thead.map( (th, indx) => (
            <div 
              className={ `view-table__header ${ extraspace.includes(th) ? 'extra-space' : '' }` } 
              key={ indx }
            >
              { th }
            </div>
          ))
        }
        </div>
      </div>
    )
  }

  getDateAndHour(time) {
    return time.slice(0,16).split('T')
  }

  renderDataCell(key, indx, obj) {
    switch(key) {
      case 'phoneNumber' :
        const [ ft, snd, trd ] = [
          obj[ key ].slice(0,3), 
          obj[ key ].slice(3,6), 
          obj[ key ].slice(6)
        ]

        return <div key={ indx } className="view-table__data">{ `(${ ft })-${ snd }-${ trd }` }</div>
      case 'departing' :
        const [ date, time ] = this.getDateAndHour(obj[ key ])

        return [
          <div key={ indx } className="view-table__data">{ date }</div>,
          <div key={ indx + 100 } className="view-table__data">{ time }</div>
        ]
      case 'modifiedAt' :
      case 'lastSession' :
        const lastSession = this.getDateAndHour(obj[ key ]).join(' at ')

        return <div key={ indx } className={`view-table__data extra-space`}>{ lastSession }</div>
      default :
        return <div key={ indx } className="view-table__data">{ obj[ key ] }</div>
    }
  }

  renderData() {
    const { tdata, fetching, onRowClick, switchToRoute } = this.props
    const { overlayHeight } = this.state
    
    return (
      <div className="view-table__body">
        {
          tdata.length
          ? tdata.map((td, indx) => (
            <div className="view-table__row" onClick={() => onRowClick(switchToRoute, td)} key={ indx }>
              {
                Object
                  .keys(td)
                  .filter(key => {
                    return !['personid', '_id', '__v', 'created_at'].includes(key)
                  })
                  .map((key, index) => this.renderDataCell(key, index, td))
              }
            </div>
          ))
          : <div className="view-table__row">
              <div className="view-table__data">
                { 'There is no data available' }
              </div>
            </div>
        }
        {
          fetching &&
          <div className="overlay-fetching" style={{ height : `${ overlayHeight }px` }}>{ 'fetching' }</div>
        }
      </div>
    )
  }

  renderNavNumbers() {
    const { skip } = this.state
    const { limit, count } = this.props

    let pages = Math.ceil(count / limit)
    let page = skip / limit

    const range = [...Array(pages).keys()]

    const res = range.filter(i => (
      i == 0 || i == pages - 1 || (i >= page - 2 && i <= page + 2)
    ))

    return res
    // TODO : Check this out later
    // if(res <= 4) return res

    // let pagination = [0]

    // let tmp = res[ 0 ]

    // for(let i = 1; i < res.length - 1; i++) {
    //   if(res[ i ] > tmp[ i - 1 ] + 1) pagination = [].concat(pagination, '')
    //   pagination = [].concat(pagination, res[ i ])
    //   tmp = res[ i ]
    // }

    // console.log(`Pagination => ${pagination}`)
    // console.log(pages)
    // console.log(count, limit)
    // let res = [0]

    // for(let i = 1; i < pagination.length; i++) {
    //   if(res[ res.length ] + 1
    // }


    // hardcoded shit
    // if (pages < 4) res = [].concat([...Array(pages).keys()].map(i => i)) /* This one works */
    // else if(page > ) res = [].concat([ 0, pages - 3, pages - 2, pages -1 ])
    // else res = [].concat([ 0, '', page - 1, page, page + 1, '', pages - 1])

  //   console.log(`Paginate                => ${ res }`)
  //   console.log(`skip/limit              => ${ page } (page)`)
  //   console.log(`Mat.ceil(count/limit)   => ${ pages } (pages)`)
  //   console.log(`Count                   => ${ count }`)
  //   console.log(`Skip                    => ${ skip }`)
  //   console.log(`Limit                   => ${ limit }`)

    // return pagination
  }

  renderFooter() {
    const { canNext, canPrev } = this.state
    const { limit } = this.props
    // const { canNext, canPrev, clickNext, clickPrev } = this.props

    return (
      <div className="view-table__footer">
        <div
          className={`view-table__footer-prev ${ canPrev ? '' : 'disabled' }`}
          onClick={ () => this._onClickNav('prev') }
        >
          { '<<<'}
        </div>
        <div className="view-table__footer-nav">
          {
            this.renderNavNumbers().map((li, indx) => (
              <div
                key={ indx }
                onClick={
                  Number.isInteger(li)
                  ? () => this._onClickPagination(limit, li * limit)
                  : undefined
                }
                className={ `view-table__footer-pagination ${ li ? '' : 'no-style' }` }
              >
                {
                  Number.isInteger(li)
                  ? li + 1
                  : '...'
                }
              </div>
            ))
          }
        </div>
        <div
          className={ `view-table__footer-next ${ canNext ? '' : 'disabled' }` }
          onClick={ () => this._onClickNav('next') }
        >
          { '>>>' }
        </div>
      </div>
    )
  }

  _onClickPagination(limit, nSkip) {
    // console.log(nSkip)
    const { skip } = this.state

    if(nSkip !== skip) this.setState({ 
      //
      skip : nSkip 
    }, () => { this.requestUpdateList(limit, nSkip) })
  }

  requestUpdateList(limit, skip) {
    const { updateList } = this.props

    return updateList(limit, skip)
  }

  _onClickNav(where) {
    const { limit, count, updateList } = this.props
    let { skip, canNext, canPrev } = this.state

    if(where === 'next') {
      if(canNext) {
        skip += limit

        this.setState({ skip })
        return this.requestUpdateList(limit, skip)
      }
    } else {
      if(canPrev) {
        if(skip - limit < 0) skip = 0
        else skip -= limit

        this.setState({ skip })
        return this.requestUpdateList(limit, skip)
      }
    }

    return null
  }

  componentDidUpdate() {
    const { clientHeight } = document.querySelector('.view-table__body')

    this.setState({ overlayHeight : clientHeight })
  }

  componentWillReceiveProps(props) {
    const { count, limit } = props
    const { skip } = this.state

    let [ canNext, canPrev ] = [ false, false ]

    if(skip + limit < count) canNext = true
    if(skip - limit >= 0) canPrev = true

    this.setState({ canNext, canPrev })
  }

  render() {
    return (
      <div className="view-table">
        { this.renderHeader() }
        { this.renderData() }
        { this.renderFooter() }
      </div>
    )
  }
}

TableList.PropTypes = {
  thead : PropTypes.array.isRequired,
  tdata : PropTypes.arrayOf(PropTypes.object),
  fetching : PropTypes.bool.isRequired,
  updateList : PropTypes.func.isRequired,
  limit : PropTypes.number.isRequired,
  count : PropTypes.number.isRequired,
  onRowClick : PropTypes.func.isRequired,
  switchToRoute : PropTypes.string.isRequired,
}

export default TableList
