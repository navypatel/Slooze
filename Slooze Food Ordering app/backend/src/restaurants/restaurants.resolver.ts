import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu-item.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Restaurant)
@UseGuards(JwtAuthGuard)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  @Query(() => [Restaurant])
  async restaurants(@CurrentUser() user: User) {
    // Apply country filter for Managers and Members
    const userCountry = user.role === 'ADMIN' ? undefined : user.country;
    return this.restaurantsService.findAll(userCountry);
  }

  @Query(() => Restaurant, { nullable: true })
  async restaurant(@Args('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Query(() => [MenuItem])
  async menuItems(@Args('restaurantId') restaurantId: string) {
    return this.restaurantsService.getMenuItems(restaurantId);
  }
}
