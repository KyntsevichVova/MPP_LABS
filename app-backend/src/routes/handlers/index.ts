import { Connection } from '../../lib/connection';
import { DEFAULT_FILTER } from '../../lib/constants';
import { Model } from '../../lib/model';
import { RequestHandler } from '../../lib/types';

export function handleIndex(con: Connection): RequestHandler {
    return (req, res) => {
        const filters = String(req.query.filter ?? DEFAULT_FILTER)
            .split(',')
            .map((filter) => con.escape(filter.toUpperCase()))
            .join(', ');
        
        con.query(
            `SELECT * FROM TASK
            WHERE
                (TASK_ID > 0)
            AND
                (TASK_STATUS IN (${filters}))
            ORDER BY 
                CREATED_AT DESC`,
            (error, result) => {
                if (error || result.rows.length < 1) {
                    let model = new Model();
                    model.setFilters(String(req.query.filter ?? DEFAULT_FILTER).split(','));
                    res.render('index', model);
                } else {
                    let model = new Model(result.rows.map(Model.createTask));
                    model.setFilters(String(req.query.filter ?? DEFAULT_FILTER).split(','));
                    res.render('index', model);
                }
            }
        );
    }
}