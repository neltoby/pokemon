import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { FIRST_GENERATION_MAX, READ_CACHE_MAX_AGE_SECONDS, IMAGE_CACHE_MAX_AGE_SECONDS, UPSTREAM_TIMEOUT_MS } from '../../shared/constants';
import { PokemonController } from '../../interface-adapters/controllers/pokemon.controller';
import { plainToInstance } from 'class-transformer';
import { validateDto } from '../../shared/validation/validate-dto';
import { ListPokemonQueryDTO } from '../../application/dto/list-pokemon-query.dto';

export function createPokemonRouter(
  pokemonController: PokemonController,
): Router {
  const router = Router();

  // GET /api/pokemon?limit=50&offset=0 (capped to first 150)
  router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToInstance(ListPokemonQueryDTO, {
          limit: req.query.limit,
          offset: req.query.offset,
        });
        await validateDto(dto);

        const MAX_TOTAL = FIRST_GENERATION_MAX;
        const offset = dto.offset;

        if (offset >= MAX_TOTAL) {
          // Fresh for configured duration; no background revalidation
          res.set('Cache-Control', `public, max-age=${READ_CACHE_MAX_AGE_SECONDS}`);
          res.set('Vary', 'Accept-Encoding');
          return res.json({ items: [], hasMore: false, nextOffset: null });
        }

        const effectiveLimit = Math.min(dto.limit, Math.max(0, MAX_TOTAL - offset));

        const items = await pokemonController.listFirstGeneration(
          effectiveLimit,
          offset,
        );

        const totalSoFar = offset + items.length;
        const hasMore = totalSoFar < MAX_TOTAL && items.length === effectiveLimit;
        const nextOffset = hasMore ? totalSoFar : null;
        // Fresh for configured duration; no background revalidation
        res.set('Cache-Control', `public, max-age=${READ_CACHE_MAX_AGE_SECONDS}`);
        res.set('Vary', 'Accept-Encoding');
        res.json({ items, hasMore, nextOffset });
      } catch (err) {
        next(err);
      }
    },
  );

  // GET /api/pokemon/:nameOrId/image - proxy image with multi-source fallbacks
  router.get(
    '/:nameOrId/image',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { nameOrId } = req.params;
        // Resolve details once and prefer sprites.back_default
        const details = await pokemonController.getDetails(nameOrId);
        const primary = details.imageUrl || null;

        // If no back_default is available, fall back to known sprite locations by id
        const id = details.id;
        const candidates = [
          primary,
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
        ].filter(Boolean) as string[];

        let data: Buffer | null = null;
        let contentType = 'image/png';

        for (const url of candidates) {
          try {
            const resp = await axios.get<ArrayBuffer>(url, {
              responseType: 'arraybuffer',
              timeout: UPSTREAM_TIMEOUT_MS,
              validateStatus: (s) => s >= 200 && s < 400,
            });
            data = Buffer.from(resp.data);
            contentType = resp.headers['content-type'] || (url.endsWith('.svg') ? 'image/svg+xml' : 'image/png');
            break;
          } catch {
            // try next
          }
        }

        if (!data) return res.status(404).send();

        res.setHeader('Content-Type', contentType);
        // Fresh for configured duration; no background revalidation
        res.setHeader('Cache-Control', `public, max-age=${IMAGE_CACHE_MAX_AGE_SECONDS}, must-revalidate`);
        res.setHeader('Vary', 'Accept-Encoding');
        return res.status(200).end(data);
      } catch (err) {
        next(err);
      }
    },
  );

  // GET /api/pokemon/:nameOrId
  router.get(
    '/:nameOrId',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { nameOrId } = req.params;
        const data = await pokemonController.getDetails(nameOrId);
        // Fresh for configured duration; no background revalidation
        res.set('Cache-Control', `public, max-age=${READ_CACHE_MAX_AGE_SECONDS}`);
        res.set('Vary', 'Accept-Encoding');
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}
